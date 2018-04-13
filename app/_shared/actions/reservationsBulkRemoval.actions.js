import moment from 'moment'

import actionFactory                                   from '../helpers/actionFactory'
import { request }                                     from '../helpers/request'
import requestPromise                                  from '../helpers/requestPromise'
import { t }                                           from '../modules/localization/localization'
import { timeToUTC, MOMENT_DATETIME_FORMAT, ceilTime } from '../helpers/time'

import { RESERVATIONS_QUERY, DESTROY_RESERVATIONS } from '../queries/reservationsBulkRemoval.queries'
import { GET_AVAILABLE_USERS }                      from '../queries/newReservation.queries'

import { mobile } from '../../index'


export const SET_BULK_REMOVAL_GARAGES = 'SET_GARAGES'
export const SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED = 'SET_RESERVATION_TO_BE_REMOVED'
export const SET_BULK_REMOVAL_AVAILABLE_USERS = 'SET_AVAILABLE_USERS'
export const SET_BULK_REMOVAL_USER_ID = 'SET_USER_ID'
export const SET_BULK_REMOVAL_TO = 'SET_TO'
export const SET_BULK_REMOVAL_FROM = 'SET_FROM'
export const BULK_REMOVAL_CLEAR_FORM = 'BULK_REMOVAL_CLEAR_FORM'


export const setAvailableUsers = actionFactory(SET_BULK_REMOVAL_AVAILABLE_USERS)
export const setUserId = actionFactory(SET_BULK_REMOVAL_USER_ID)
export const setTo = actionFactory(SET_BULK_REMOVAL_TO)
export const setFrom = actionFactory(SET_BULK_REMOVAL_FROM)
export const clearForm = actionFactory(BULK_REMOVAL_CLEAR_FORM)
export const setReservationsToBeRemoved = actionFactory(SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED)
export const setGarages = actionFactory(SET_BULK_REMOVAL_GARAGES)

// function formatGarages(reservations) {
//   return reservations.reduce((accum, reservation) => {
//     const garage = accum.findById(reservation.garage.id)
//     if (garage) {
//       const client = garage.clients.findById(reservation.client.id)
//       if (client) {
//         client.reservations.push(reservation)
//       } else {
//         garage.clients.push({ ...reservation.client, reservations: [ reservation ] })
//       }
//     } else {
//       accum.push({
//         ...reservation.garage,
//         clients: [ {
//           ...reservation.client,
//           reservations: [ reservation ]
//         } ]
//       })
//     }
//     return accum
//   }, [])
// }

function find(id, array, emptyObject) {
  const foundObject = array.findById(id)
  if (!foundObject) array.push(emptyObject)
  return foundObject || array.findById(id)
}

function formatGarages(reservations) {
  return reservations.reduce((accum, reservation) => {
    const garage = find(reservation.garage.id, accum, { ...reservation.garage, clients: [] })
    const client = find(reservation.client.id, garage.clients, { ...reservation.client, reservations: [] })
    client.reservations.push(reservation)
    return accum
  }, [])
}

export function adjustFromDate(from) {
  return (dispatch, getState) => {
    let newFrom = moment(from, MOMENT_DATETIME_FORMAT)
    let to = moment(getState().reservationBulkRemoval.to, MOMENT_DATETIME_FORMAT)
    if (moment().isAfter(newFrom)) {
      newFrom = ceilTime(moment())
    }
    if (newFrom.isSameOrAfter(to)) {
      to = newFrom.clone().add(30, 'm')
      dispatch(setTo(to.format(MOMENT_DATETIME_FORMAT)))
    }
    dispatch(setFrom(newFrom.format(MOMENT_DATETIME_FORMAT)))
  }
}

export function adjustToDate(to) {
  return (dispatch, getState) => {
    const from = moment(getState().reservationBulkRemoval.from, MOMENT_DATETIME_FORMAT)
    let newTo = moment(to, MOMENT_DATETIME_FORMAT)
    if (newTo.isSameOrBefore(from)) {
      newTo = from.clone().add(30, 'm')
    }
    dispatch(setTo(newTo.format(MOMENT_DATETIME_FORMAT)))
  }
}

export function setReservationToBeRemove(id) {
  return (dispatch, getState) => {
    // Create a copy of array
    const toBeRemoved = getState().reservationBulkRemoval.toBeRemoved.slice()
    const index = toBeRemoved.findIndex(e => e === id)
    if (index > -1) {
      toBeRemoved.splice(index, 1)
    } else {
      toBeRemoved.push(id)
    }
    dispatch({
      type:  SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED,
      value: toBeRemoved
    })
  }
}

// export function cancelSelection() {
//   return dispatch => {
//     dispatch({
//       type:  SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED,
//       value: []
//     })
//   }
// }

export function setClientsReservationsToBeRemove(client) {
  return (dispatch, getState) => {
    const { toBeRemoved } = getState().reservationBulkRemoval
    client.reservations.forEach(reservation => {
      const index = toBeRemoved.findIndex(e => e === reservation.id)
      if (index < 0) {
        dispatch(setReservationToBeRemove(reservation.id))
      }
    })
  }
}

export function unsetClientsReservationsToBeRemove(client) {
  return (dispatch, getState) => {
    const { toBeRemoved } = getState().reservationBulkRemoval
    client.reservations.forEach(reservation => {
      const index = toBeRemoved.findIndex(e => e === reservation.id)
      if (index >= 0) {
        dispatch(setReservationToBeRemove(reservation.id))
      }
    })
  }
}

// export function setGarages(reservations = []) {
//   return dispatch => {
//     // let garages = {}
//     // if (reservations && reservations.length > 0) {
//     //   garages = formatGarages(reservations)
//     // } else {
//     //   garages.noData = true
//     // }
//     dispatch({
//       type:  SET_BULK_REMOVAL_GARAGES,
//       value: reservations.length > 0 ? formatGarages(reservations) : { noData: true }
//     })
//   }
// }

// export function selectReservations(reservations) {
//   return dispatch => {
//     dispatch({
//       type:  SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED,
//       value: reservations.map(reservation => reservation.id)
//     })
//   }
// }

export function loadReservations() {
  return (dispatch, getState) => {
    const { userId, from, to } = getState().reservationBulkRemoval
    requestPromise(RESERVATIONS_QUERY, {
      user_id:   userId,
      from:      timeToUTC(from),
      to:        timeToUTC(to),
      secretary: getState().pageBase.current_user.secretary
    }).then(data => {
      if (data) {
        const reservations = data.reservations_in_dates
        dispatch(setGarages(reservations.length > 0 ? formatGarages(reservations) : { noData: true }))
        dispatch(setReservationsToBeRemoved(reservations.map(reservation => reservation.id)))
        // dispatch(selectReservations(data.reservations_in_dates))
      } else {
        dispatch(setGarages({ noData: true }))
        dispatch(setReservationsToBeRemoved([]))
        // dispatch(cancelSelection())
      }
    })
  }
}

export function loadAvailableUsers() {
  return (dispatch, getState) => {
    const currentUser = getState().pageBase.current_user

    currentUser && requestPromise(GET_AVAILABLE_USERS, { id: currentUser.id }).then(data => {
      const users = [
        ...data.reservable_users,
        currentUser && currentUser.secretary && {
          full_name: t([ 'bulkCancellation', 'allUsers' ]),
          id:        -1
        }
      ].filter(o => o)

      if (users.length === 1) dispatch(setUserId(users[0].id))
      dispatch(setAvailableUsers(users))
    })
  }
}

export function destroyAllSelectedReservations(callback = undefined, OnError = undefined) {
  return (dispatch, getState) => {
    const { toBeRemoved } = getState().reservationBulkRemoval
    const onSuccess = () => {
      if (mobile) {
        callback()
      }
    }
    request(onSuccess, DESTROY_RESERVATIONS, { ids: toBeRemoved }, 'BulkCancelation', OnError)
    dispatch(loadReservations())
  }
}

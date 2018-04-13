import moment from 'moment'

import actionFactory from '../helpers/actionFactory'
import { request } from '../helpers/request'
import requestPromise from '../helpers/requestPromise'
import { t } from '../modules/localization/localization'
import { timeToUTC, MOMENT_DATETIME_FORMAT } from '../helpers/time'

import { RESERVATIONS_QUERY, DESTROY_RESERVATIONS } from '../queries/bulkRemoval.queries'
import { GET_AVAILABLE_USERS } from '../queries/newReservation.queries'

import { mobile } from '../../index'


export const RESERVATIONS_PER_PAGE = 5

export const SET_GARAGES = 'SET_GARAGES'
export const SET_RESERVATION_TO_BE_REMOVED = 'SET_RESERVATION_TO_BE_REMOVED'
export const SET_AVAILABLE_USERS = 'SET_AVAILABLE_USERS'
export const SET_USER_ID = 'SET_USER_ID'
export const SET_TO = 'SET_TO'
export const SET_FROM = 'SET_FROM'

export const setAvailableUsers = actionFactory(SET_AVAILABLE_USERS)
export const setUserId = actionFactory(SET_USER_ID)
export const setTo = actionFactory(SET_TO)
export const setFrom = actionFactory(SET_FROM)

function formatGarages(reservations) {
  return reservations.reduce((accum, reservation) => {
    const garage = accum.find(g => g.id === reservation.garage.id)
    if (garage) {
      const client = garage.clients.find(c => c.id === reservation.client.id)
      if (client) {
        client.reservations.push(reservation)
      } else {
        garage.clients.push({ ...reservation.client, reservations: [ reservation ] })
      }
    } else {
      accum.push({
        ...reservation.garage,
        clients: [ {
          ...reservation.client,
          reservations: [ reservation ]
        } ]
      })
    }
    return accum
  }, [])
}

export function roundTimeUp(time) {
  return moment(time, MOMENT_DATETIME_FORMAT).set('minute', Math.ceil(moment(time, MOMENT_DATETIME_FORMAT).minutes() / 15) * 15)
}

export function adjustFromDate(from) {
  return (dispatch, getState) => {
    let newFrom = moment(from, MOMENT_DATETIME_FORMAT)
    let to = moment(getState().reservationBulkRemoval.to, MOMENT_DATETIME_FORMAT)
    if (moment().isAfter(newFrom)) {
      newFrom = roundTimeUp(moment())
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
      type:  SET_RESERVATION_TO_BE_REMOVED,
      value: toBeRemoved
    })
  }
}

export function cancelSelection() {
  return dispatch => {
    dispatch({
      type:  SET_RESERVATION_TO_BE_REMOVED,
      value: []
    })
  }
}

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

export function setGarages(reservations) {
  return dispatch => {
    let garages = {}
    if (reservations && reservations.length > 0) {
      garages = formatGarages(reservations)
    } else {
      garages.noData = true
    }
    dispatch({
      type:  SET_GARAGES,
      value: garages
    })
  }
}

export function selectReservations(reservations) {
  return dispatch => {
    const ids = reservations.reduce((acc, reservation) => {
      acc.push(reservation.id)
      return acc
    }, [])
    dispatch({
      type:  SET_RESERVATION_TO_BE_REMOVED,
      value: ids
    })
  }
}

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
        dispatch(setGarages(data.reservations_in_dates))
        dispatch(selectReservations(data.reservations_in_dates))
      } else {
        dispatch(setGarages())
        dispatch(cancelSelection())
      }
    })
  }
}

export function loadAvailableUsers() {
  return (dispatch, getState) => {
    const currentUser = getState().pageBase.current_user
    const selectedUserId = getState().reservationBulkRemoval.userId
    requestPromise(GET_AVAILABLE_USERS, {
      id: +currentUser.id
    }).then(data => {
      const users = data.reservable_users
      if (currentUser && currentUser.secretary) {
        users.push({
          full_name: t([ 'bulkCancellation', 'allUsers' ]),
          id:        -1
        })
        if (!selectedUserId) {
          dispatch(setUserId(-1))
        }
      }
      if (users.length === 1) {
        dispatch(setUserId(users[0].id))
      }
      dispatch(setAvailableUsers(users))
    })
  }
}

export function initStorage() {
  return (dispatch, getState) => {
    const { from, to } = getState().reservationBulkRemoval
    if (!(from && to)) {
      const newFrom = roundTimeUp(moment())
      const newTo = newFrom.clone().add(30, 'm')
      dispatch(setFrom(newFrom.format(MOMENT_DATETIME_FORMAT)))
      dispatch(setTo(newTo.format(MOMENT_DATETIME_FORMAT)))
    }
    dispatch(loadAvailableUsers())
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

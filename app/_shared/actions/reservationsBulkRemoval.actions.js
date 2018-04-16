import moment from 'moment'

import actionFactory                                   from '../helpers/actionFactory'
import requestPromise                                  from '../helpers/requestPromise'
import { t }                                           from '../modules/localization/localization'
import { timeToUTC, MOMENT_DATETIME_FORMAT, ceilTime } from '../helpers/time'

import { RESERVATIONS_QUERY, DESTROY_RESERVATIONS } from '../queries/reservationsBulkRemoval.queries'
import { GET_AVAILABLE_USERS }                      from '../queries/newReservation.queries'


export const SET_BULK_REMOVAL_GARAGES = 'SET_GARAGES'
export const TOGGLE_RESERVATION_IN_TO_BE_REMOVED = 'TOGGLE_RESERVATION_IN_TO_BE_REMOVED'
export const SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED = 'SET_RESERVATION_TO_BE_REMOVED'
export const SET_BULK_REMOVAL_AVAILABLE_USERS = 'SET_AVAILABLE_USERS'
export const SET_BULK_REMOVAL_USER_ID = 'SET_USER_ID'
export const SET_BULK_REMOVAL_TO = 'SET_TO'
export const SET_BULK_REMOVAL_FROM = 'SET_FROM'
export const BULK_REMOVAL_CLEAR_FORM = 'BULK_REMOVAL_CLEAR_FORM'


export const setAvailableUsers = actionFactory(SET_BULK_REMOVAL_AVAILABLE_USERS)
export const toggleReservation = actionFactory(TOGGLE_RESERVATION_IN_TO_BE_REMOVED)
export const setUserId = actionFactory(SET_BULK_REMOVAL_USER_ID)
export const setTo = actionFactory(SET_BULK_REMOVAL_TO)
export const setFrom = actionFactory(SET_BULK_REMOVAL_FROM)
export const clearForm = actionFactory(BULK_REMOVAL_CLEAR_FORM)
export const setReservationsToBeRemoved = actionFactory(SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED)
export const setGarages = actionFactory(SET_BULK_REMOVAL_GARAGES)


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

    if (moment().isAfter(newFrom)) newFrom = ceilTime(moment())
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

    if (newTo.isSameOrBefore(from)) newTo = from.clone().add(30, 'm')

    dispatch(setTo(newTo.format(MOMENT_DATETIME_FORMAT)))
  }
}

export function setReservationsInClient(to, client) {
  return (dispatch, getState) => {
    client.reservations.forEach(reservation => {
      if (getState().reservationBulkRemoval.toBeRemoved.includes(reservation.id) !== to) {
        dispatch(toggleReservation(reservation.id))
      }
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
        const reservations = data.reservations_in_dates
        dispatch(setGarages(reservations.length > 0 ? formatGarages(reservations) : { noData: true }))
        dispatch(setReservationsToBeRemoved(reservations.map(reservation => reservation.id)))
      } else {
        dispatch(setGarages({ noData: true }))
        dispatch(setReservationsToBeRemoved([]))
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

export function destroyAllSelectedReservations() {
  return (dispatch, getState) => {
    const { toBeRemoved } = getState().reservationBulkRemoval

    requestPromise(DESTROY_RESERVATIONS, { ids: toBeRemoved })
    .then(() => dispatch(loadReservations()))
  }
}

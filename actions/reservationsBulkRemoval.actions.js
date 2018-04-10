import moment from 'moment'

import actionFactory from '../helpers/actionFactory'
import { request } from '../helpers/request'
import requestPromise from '../helpers/requestPromise'
import { t } from '../modules/localization/localization'
import { parseParameters } from '../helpers/parseUrlParameters'
import { timeToUTC, MOMENT_DATETIME_FORMAT, MIN_RESERVATION_DURATION } from '../helpers/time'
import { roundTime } from '../actions/newReservation.actions'

import { GARAGE_DETAILS_QUERY, GARAGE_CLIENTS_QUERY } from '../queries/occupancy.queries'
import { DESTROY_RESERVATION, DESTROY_RECURRING_RESERVATIONS } from '../queries/reservations.queries'
import { RESERVATIONS_QUERY } from '../queries/bulkRemoval.queries'
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
    const garages = formatGarages(reservations)
    dispatch({
      type:  SET_GARAGES,
      value: garages
    })
  }
}

export function loadReservations() {
  return (dispatch, getState) => {
    const state = getState().reservationBulkRemoval
    requestPromise(RESERVATIONS_QUERY, {
      user_id:   state.userId,
      from:      timeToUTC(state.from),
      to:        timeToUTC(state.to),
      secretary: true
    }).then(data => {
      dispatch(setGarages(data.reservations_in_dates))
    })
  }
}

export function loadAvailableUsers() {
  return (dispatch, getState) => {
    const curretUserId = getState().pageBase.current_user.id
    requestPromise(GET_AVAILABLE_USERS, {
      id: +curretUserId
    }).then(data => {
      const users = data.reservable_users
      const curretnUser = getState().pageBase.current_user
      if (curretnUser && curretnUser.secretary) {
        users.push({
          full_name: 'All users',
          id:        -1
        })
      }
      dispatch(setAvailableUsers(data.reservable_users))
    })
  }
}

export function formatFrom() {
  return (dispatch, getState) => {
    let fromValue = moment(roundTime(getState().reservationBulkRemoval.from), MOMENT_DATETIME_FORMAT)
    let toValue = null
    const now = moment(roundTime(moment()), MOMENT_DATETIME_FORMAT)

    if (fromValue.diff(now, 'minutes') < 0) { // cannot create reservations in the past
      fromValue = now
    }

    if (moment(getState().reservationBulkRemoval.to, MOMENT_DATETIME_FORMAT).isValid() &&
        moment(getState().reservationBulkRemoval.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      toValue = fromValue.clone().add(MIN_RESERVATION_DURATION, 'minutes').format(MOMENT_DATETIME_FORMAT)
      dispatch(setTo(toValue))
    }
  }
}

export function formatTo() {
  return (dispatch, getState) => {
    let toValue = moment(roundTime(getState().reservationBulkRemoval.to), MOMENT_DATETIME_FORMAT)
    const fromValue = moment(getState().reservationBulkRemoval.from, MOMENT_DATETIME_FORMAT)

    if (toValue.diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      toValue = fromValue.add(MIN_RESERVATION_DURATION, 'minutes')
    }

    dispatch({ type:  SET_TO,
      value: toValue.format(MOMENT_DATETIME_FORMAT)
    })
  }
}

export function destroyReservation(id, callback) {
  return () => {
    const onSuccess = response => {
      if (mobile) {
        callback()
      }
    }
    request(onSuccess, DESTROY_RESERVATION, { id })
  }
}

export function destroyRecurringReservations(id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(initReservations())
    }
    request(onSuccess, DESTROY_RECURRING_RESERVATIONS, { id })
  }
}

export function destroyAllSelectedReservations() {
  return (dispatch, getState) => {
    const { toBeRemoved } = getState().reservationBulkRemoval
    toBeRemoved.forEach(reservation => {
      destroyReservation(reservation)
    })
    cancelSelection()
    loadReservations()
  }
}

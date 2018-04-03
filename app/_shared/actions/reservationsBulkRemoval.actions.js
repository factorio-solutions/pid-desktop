import actionFactory from '../helpers/actionFactory'
import { request } from '../helpers/request'
import requestPromise from '../helpers/requestPromise'
import { t } from '../modules/localization/localization'
import { parseParameters } from '../helpers/parseUrlParameters'
import { timeToUTC }  from '../helpers/time'

import { GARAGE_DETAILS_QUERY, GARAGE_CLIENTS_QUERY } from '../queries/occupancy.queries'
import { DESTROY_RESERVATION, DESTROY_RECURRING_RESERVATIONS } from '../queries/reservations.queries'
import { RESERVATIONS_QUERY } from '../queries/bulkRemoval.queries'

import { mobile } from '../../index'


export const RESERVATIONS_PER_PAGE = 5

export const SET_GARAGES = 'SET_GARAGES'
export const SET_RESERVATION_TO_BE_REMOVED = 'SET_RESERVATION_TO_BE_REMOVED'

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
      user_id:   -1,
      from:      timeToUTC(state.from),
      to:        timeToUTC(state.to),
      secretary: true
    }).then(data => {
      dispatch(setGarages(data.reservations_in_dates))
    })
  }
}

export function initReservations() {
  return dispatch => {
    dispatch(loadReservations())
  }
}

export function addReservations() {
  return []
}

export function destroyReservation(id, callback) {
  return dispatch => {
    const onSuccess = response => {
      if (mobile) {
        callback()
      } else {
        dispatch(initReservations())
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


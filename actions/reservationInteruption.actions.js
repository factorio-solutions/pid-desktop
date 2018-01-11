import request       from '../helpers/requestPromise'
import { timeToUTC } from '../helpers/time'

import { INTERUPT_RESERVATION } from '../queries/reservationInteruption.queries.js'
import { initReservations }     from './reservations.actions'
import { mobile } from '../../index'


export const RESERVATION_INTERUPTION_SET_RESERVATION = 'RESERVATION_INTERUPTION_SET_RESERVATION'
export const RESERVATION_INTERUPTION_SET_FROM = 'RESERVATION_INTERUPTION_SET_FROM'
export const RESERVATION_INTERUPTION_SET_TO = 'RESERVATION_INTERUPTION_SET_TO'


export function setReservation(value) {
  return {
    type: RESERVATION_INTERUPTION_SET_RESERVATION,
    value
  }
}

export function setFrom(value) {
  return {
    type: RESERVATION_INTERUPTION_SET_FROM,
    value
  }
}

export function setTo(value) {
  return {
    type: RESERVATION_INTERUPTION_SET_TO,
    value
  }
}


function generalReservationInteruption(callback, id, from, to) {
  return dispatch => {
    request(INTERUPT_RESERVATION, { id, from, to })
    .then(() => {
      if (mobile) {
        dispatch(setReservation())
        callback()
      } else {
        dispatch(initReservations())
        dispatch(setReservation())
      }
    })
  }
}

export function interuptReservation(callback) {
  return (dispatch, getState) => {
    const state = getState().reservationInteruption
    dispatch(generalReservationInteruption(callback, state.reservation.id, timeToUTC(state.from), timeToUTC(state.to)))
  }
}

export function immediateReservationTermination(reservation, callback) {
  return dispatch => dispatch(generalReservationInteruption(callback, reservation.id))
}

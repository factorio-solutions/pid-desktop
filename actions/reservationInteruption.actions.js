import request       from '../helpers/requestPromise'
import { timeToUTC } from '../helpers/time'
import actionFactory from '../helpers/actionFactory'

import { INTERUPT_RESERVATION } from '../queries/reservationInteruption.queries.js'
import { initReservations }     from './reservations.actions'
import { mobile } from '../../index'


export const RESERVATION_INTERUPTION_SET_RESERVATION = 'RESERVATION_INTERUPTION_SET_RESERVATION'
export const RESERVATION_INTERUPTION_SET_FROM = 'RESERVATION_INTERUPTION_SET_FROM'
export const RESERVATION_INTERUPTION_SET_TO = 'RESERVATION_INTERUPTION_SET_TO'
export const RESERVATION_INTERUPTION_FORMAT_FROM = 'RESERVATION_INTERUPTION_FORMAT_FROM'
export const RESERVATION_INTERUPTION_FORMAT_TO = 'RESERVATION_INTERUPTION_FORMAT_TO'


export const setReservation = actionFactory(RESERVATION_INTERUPTION_SET_RESERVATION)
export const setFrom = actionFactory(RESERVATION_INTERUPTION_SET_FROM)
export const setTo = actionFactory(RESERVATION_INTERUPTION_SET_TO)
export const formatFrom = actionFactory(RESERVATION_INTERUPTION_FORMAT_FROM)
export const formatTo = actionFactory(RESERVATION_INTERUPTION_FORMAT_TO)


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

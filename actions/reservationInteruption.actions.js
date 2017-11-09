import request       from '../helpers/requestPromise'
import { timeToUTC } from '../helpers/time'

import { INTERUPT_RESERVATION } from '../queries/reservationInteruption.queries.js'
import { initReservations }     from './reservations.actions'


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


export function interuptReservation() {
  return (dispatch, getState) => {
    const state = getState().reservationInteruption
    request(INTERUPT_RESERVATION, { id: state.reservation.id, from: timeToUTC(state.from), to: timeToUTC(state.to) }).then(response => {
      dispatch(initReservations())
      dispatch(setReservation())
    })
  }
}

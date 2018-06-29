import requestPromise      from '../helpers/requestPromise'
import actionFactory       from '../helpers/actionFactory'
import minMaxDurationCheck from '../helpers/minMaxDurationCheck'

import { UPDATE_CLIENT_DURATIONS } from '../queries/admin.clientMinMaxDuration.queries'

export const ADMIN_CLIENT_SET_MIN_RESERVATION_DURATION = 'ADMIN_CLIENT_SET_MIN_RESERVATION_DURATION'
export const ADMIN_CLIENT_SET_MAX_RESERVATION_DURATION = 'ADMIN_CLIENT_SET_MAX_RESERVATION_DURATION'


export const setMinReservationDuration = actionFactory(ADMIN_CLIENT_SET_MIN_RESERVATION_DURATION)
export const setMaxReservationDuration = actionFactory(ADMIN_CLIENT_SET_MAX_RESERVATION_DURATION)


function checkMinMaxReservationDuration(changeMin) {
  return (dispatch, getState) => {
    const state = getState().clients

    const { newMin, newMax } = minMaxDurationCheck(state.minReservationDuration, state.maxReservationDuration, changeMin)
    dispatch(setMinReservationDuration(newMin))
    dispatch(setMaxReservationDuration(newMax))
  }
}

export function checkMinReservationDuration() {
  return dispatch => dispatch(checkMinMaxReservationDuration(false))
}

export function checkMaxReservationDuration() {
  return dispatch => dispatch(checkMinMaxReservationDuration(true))
}


export function initMinMaxDuration(id) {
  return dispatch => {
    requestPromise(UPDATE_CLIENT_DURATIONS, { id })
    .then(data => {
      dispatch(setMinReservationDuration(data.client.min_reservation_duration))
      dispatch(setMaxReservationDuration(data.client.max_reservation_duration))
    })
  }
}

export function submitMinMaxDuration(id) {
  return (dispatch, getState) => {
    const state = getState().clients

    requestPromise(UPDATE_CLIENT_DURATIONS, {
      id,
      client: {
        min_reservation_duration: state.minReservationDuration,
        max_reservation_duration: state.maxReservationDuration
      }
    })
  }
}

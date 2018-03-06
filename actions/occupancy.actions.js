import moment from 'moment'
import { request } from '../helpers/request'
import requestPromise from '../helpers/requestPromise'
import { timeToUTC } from '../helpers/time'
import actionFactory from '../helpers/actionFactory'
import { t } from '../modules/localization/localization'

import { OCCUPANCY_GARAGES_QUERY, GARAGE_DETAILS_QUERY, GARAGE_CLIENTS_QUERY } from '../queries/occupancy.queries'

export const OCCUPANCY_SET_GARAGES = 'OCCUPANCY_SET_GARAGES'
export const OCCUPANCY_SET_GARAGE = 'OCCUPANCY_SET_GARAGE'
export const OCCUPANCY_SET_CLIENTS = 'OCCUPANCY_SET_CLIENTS'
export const OCCUPANCY_SET_CLIENT_ID = 'OCCUPANCY_SET_CLIENT_ID'
export const OCCUPANCY_SET_DURATION = 'OCCUPANCY_SET_DURATION'
export const OCCUPANCY_SET_FROM = 'OCCUPANCY_SET_FROM'
export const OCCUPANCY_SET_LOADING = 'OCCUPANCY_SET_LOADING'


export const setGarages = actionFactory(OCCUPANCY_SET_GARAGES)
export const setGarage = actionFactory(OCCUPANCY_SET_GARAGE)
export const setClients = actionFactory(OCCUPANCY_SET_CLIENTS)
export const setLoading = actionFactory(OCCUPANCY_SET_LOADING)


export function setClientId(id) {
  return dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_CLIENT_ID,
      value: id
    })
    dispatch(loadGarage())
  }
}

export function setDuration(duration) {
  return dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_DURATION,
      value: duration
    })
    dispatch(loadGarage())
  }
}

export function setFrom(from) {
  return dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_FROM,
      value: from
    })
    dispatch(loadGarage())
  }
}

export function loadGarages() {
  return dispatch => {
    requestPromise(OCCUPANCY_GARAGES_QUERY)
    .then(data => {
      dispatch(setGarages(data.occupancy_garages))
      dispatch(loadGarage(data.occupancy_garages[0].id))
    })
  }
}

export function loadGarage(id) {
  return (dispatch, getState) => {
    const state = getState().occupancy

    requestPromise(GARAGE_DETAILS_QUERY, {
      id:         id || state.garage.id,
      from:       timeToUTC(state.from),
      to:         timeToUTC(state.from.clone().add(1, state.duration)),
      client_ids: state.client_ids
    }).then(data => dispatch(setGarage(data.garage)))
  }
}

export function loadClients() {
  return (dispatch, getState) => {
    const onClientsSuccess = response => {
      response.data.garage.clients.unshift({ name: t([ 'occupancy', 'allReservations' ]), id: undefined })
      dispatch(setClients(response.data.garage.clients))
    }

    const garage = getState().pageBase.garage
    garage && request(onClientsSuccess
      , GARAGE_CLIENTS_QUERY
      , { id: garage }
    )
  }
}

export function initOccupancy() {
  return dispatch => {
    dispatch(loadClients())
    dispatch(loadGarages())
  }
}

// =============================================================================
// occupancy actions
export function subtract() {
  return (dispatch, getState) => {
    const duration = getState().occupancy.duration
    dispatch(setFrom(moment(getState().occupancy.from).subtract(1, duration)))
  }
}

export function add() {
  return (dispatch, getState) => {
    const duration = getState().occupancy.duration
    dispatch(setFrom(moment(getState().occupancy.from).add(1, duration)))
  }
}

export function dayClick() {
  return dispatch => {
    dispatch(setDuration('day'))
  }
}

export function weekClick() {
  return dispatch => {
    dispatch(setDuration('week'))
  }
}

export function monthClick() {
  return dispatch => {
    dispatch(setDuration('month'))
  }
}

export function resetClientClick() {
  return dispatch => {
    dispatch(setClientId()) // to undefined
  }
}

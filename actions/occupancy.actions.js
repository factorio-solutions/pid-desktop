import moment from 'moment'

import requestPromise from '../helpers/requestPromise'
import { timeToUTC }  from '../helpers/time'
import actionFactory  from '../helpers/actionFactory'
import { t }          from '../modules/localization/localization'
import * as pageBase  from './pageBase.actions'

import { OCCUPANCY_GARAGES_QUERY, GARAGE_DETAILS_QUERY } from '../queries/occupancy.queries'

export const OCCUPANCY_SET_GARAGES = 'OCCUPANCY_SET_GARAGES'
export const OCCUPANCY_SET_GARAGE = 'OCCUPANCY_SET_GARAGE'
export const OCCUPANCY_SET_CLIENTS = 'OCCUPANCY_SET_CLIENTS'
export const OCCUPANCY_RESET_CLIENTS = 'OCCUPANCY_RESET_CLIENTS'
export const OCCUPANCY_SET_CLIENT_ID = 'OCCUPANCY_SET_CLIENT_ID'
export const OCCUPANCY_SET_DURATION = 'OCCUPANCY_SET_DURATION'
export const OCCUPANCY_SET_FROM = 'OCCUPANCY_SET_FROM'
export const OCCUPANCY_SET_LOADING = 'OCCUPANCY_SET_LOADING'


export const setGarages = actionFactory(OCCUPANCY_SET_GARAGES)
export const setGarage = actionFactory(OCCUPANCY_SET_GARAGE)
export const setClients = actionFactory(OCCUPANCY_SET_CLIENTS)
export const resetClients = actionFactory(OCCUPANCY_RESET_CLIENTS)
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
  return (dispatch, getState) => {
    requestPromise(OCCUPANCY_GARAGES_QUERY)
    .then(data => {
      dispatch(setGarages(data.occupancy_garages))
      dispatch(loadGarage(getState().pageBase.garage))
    })
  }
}

export function resetClientsLoadGarage(id) {
  return (dispatch, getState) => {
    if (getState().pageBase.garages.find(garage => garage.garage.id === id)) dispatch(pageBase.setGarage(id))
    dispatch(resetClients())
    dispatch(loadGarage(id))
  }
}

// It is time consuming on large garages but still faster then when it is handled on server.
function updateGarage(garage) {
  return {
    ...garage,
    floors: garage.floors.map(floor => ({
      ...floor,
      occupancy_places: floor.occupancy_places.map(place => {
        const contracts_in_interval = garage.contracts_in_interval.filter(con => !!con.places.find(p => p.id === place.id))
        const reservations_in_interval = garage.reservations_in_interval.filter(r => r.place.id === place.id)
        return {
          ...place,
          contracts_in_interval,
          reservations_in_interval
        }
      })
    }))
  }
}

export function loadGarage(id) {
  return (dispatch, getState) => {
    const state = getState().occupancy
    const garageId = id || (state.garage && state.garage.id) || (state.garages[0] && state.garages[0].id) || getState().pageBase.garage

    garageId && requestPromise(GARAGE_DETAILS_QUERY, {
      id:         garageId,
      from:       timeToUTC(state.from),
      to:         timeToUTC(state.from.clone().add(1, state.duration)),
      client_ids: state.client_ids
    }).then(data => {
      dispatch(setGarage(updateGarage(data.garage)))
      dispatch(loadClients(data.garage.clients))
    })
  }
}

export function loadClients(clients) {
  return dispatch => {
    clients.unshift({ name: t([ 'occupancy', 'allReservations' ]), id: undefined })
    dispatch(setClients(clients))
  }
}

export function initOccupancy() {
  return dispatch => {
    dispatch(loadGarages())
    dispatch(resetClientClick())
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

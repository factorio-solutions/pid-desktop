import moment from 'moment'

import { request }    from '../helpers/request'
import requestPromise from '../helpers/requestPromise'
import { timeToUTC }  from '../helpers/time'
import actionFactory  from '../helpers/actionFactory'
import { t }          from '../modules/localization/localization'
import * as pageBase  from './pageBase.actions'

import {
  OCCUPANCY_GARAGES_QUERY,
  GARAGE_DETAILS_QUERY,
  GARAGE_CLIENTS_QUERY,
  UPDATE_USERS_SETTINGS
} from '../queries/occupancy.queries'

export const OCCUPANCY_SET_GARAGES = 'OCCUPANCY_SET_GARAGES'
export const OCCUPANCY_SET_GARAGE = 'OCCUPANCY_SET_GARAGE'
export const OCCUPANCY_SET_CLIENTS = 'OCCUPANCY_SET_CLIENTS'
export const OCCUPANCY_RESET_CLIENTS = 'OCCUPANCY_RESET_CLIENTS'
export const OCCUPANCY_SET_ALL_CLIENT_IDS = 'OCCUPANCY_SET_ALL_CLIENT_IDS'
export const OCCUPANCY_SET_CLIENT_ID = 'OCCUPANCY_SET_CLIENT_ID'
export const OCCUPANCY_SET_DURATION = 'OCCUPANCY_SET_DURATION'
export const OCCUPANCY_SET_FROM = 'OCCUPANCY_SET_FROM'
export const OCCUPANCY_SET_LOADING = 'OCCUPANCY_SET_LOADING'
export const OCCUPANCY_SET_USER = 'OCCUPANCY_SET_USER'


export const setGarages = actionFactory(OCCUPANCY_SET_GARAGES)
export const setGarage = actionFactory(OCCUPANCY_SET_GARAGE)
export const setClients = actionFactory(OCCUPANCY_SET_CLIENTS)
export const setAllClientIds = actionFactory(OCCUPANCY_SET_ALL_CLIENT_IDS)
export const resetClients = actionFactory(OCCUPANCY_RESET_CLIENTS)
export const setLoading = actionFactory(OCCUPANCY_SET_LOADING)
export const setUser = actionFactory(OCCUPANCY_SET_USER)


export function setClientId(id) {
  return dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_CLIENT_ID,
      value: id
    })
    dispatch(loadGarage())
    dispatch(updateUsersSettings())
  }
}

export function setDuration(duration) {
  return dispatch => {
    dispatch({
      type:  OCCUPANCY_SET_DURATION,
      value: duration
    })
    dispatch(loadGarage())
    dispatch(updateUsersSettings())
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

      try {
        dispatch(setUser({
          ...data.current_user,
          occupancy_client_filter: JSON.parse(data.current_user.occupancy_client_filter)
        }))
      } catch (error) {
        dispatch(setUser({
          ...data.current_user,
          occupancy_client_filter: {}
        }))
      }
      dispatch({
        type:  OCCUPANCY_SET_DURATION,
        value: data.current_user.occupancy_duration
      })
      dispatch(setAllClientIds(
        JSON.parse(data.current_user.occupancy_client_filter)[getState().pageBase.garage]
        || []
      ))

      dispatch(loadGarage(getState().pageBase.garage))
    })
  }
}

export function resetClientsLoadGarage(id) {
  return (dispatch, getState) => {
    const state = getState().occupancy
    if (getState().pageBase.garages.find(garage => garage.garage.id === id)) dispatch(pageBase.setGarage(id))
    // dispatch(resetClients())
    dispatch(setAllClientIds(state.user.occupancy_client_filter[id] || []))
    dispatch(loadGarage(id))
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
    }).then(data => dispatch(setGarage(data.garage)))

    dispatch(loadClients(garageId))
  }
}

export function loadClients(id) {
  return (dispatch, getState) => {
    const onClientsSuccess = response => {
      response.data.garage.clients.unshift({ name: t([ 'occupancy', 'allReservations' ]), id: undefined })
      dispatch(setClients(response.data.garage.clients))
    }

    const garageId = id || getState().pageBase.garage
    garageId && request(onClientsSuccess,
      GARAGE_CLIENTS_QUERY,
      { id: garageId }
    )
  }
}

export function initOccupancy() {
  return dispatch => {
    dispatch(loadGarages())
  }
}

function updateUsersSettings() {
  return (dispatch, getState) => {
    const state = getState().occupancy
    requestPromise(
      UPDATE_USERS_SETTINGS,
      { id:   state.user.id,
        user: {
          occupancy_client_filter: JSON.stringify(state.user.occupancy_client_filter),
          occupancy_duration:      state.user.occupancy_duration
        }
      }
    )
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

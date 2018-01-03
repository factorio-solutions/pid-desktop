import moment from 'moment'
import { request } from '../helpers/request'
import { timeToUTC } from '../helpers/time'
import { t } from '../modules/localization/localization'

import { GARAGE_DETAILS_QUERY, GARAGE_CLIENTS_QUERY } from '../queries/occupancy.queries'

export const OCCUPANCY_SET_GARAGE = 'OCCUPANCY_SET_GARAGE'
export const OCCUPANCY_SET_CLIENTS = 'OCCUPANCY_SET_CLIENTS'
export const OCCUPANCY_SET_CLIENT_ID = 'OCCUPANCY_SET_CLIENT_ID'
export const OCCUPANCY_SET_DURATION = 'OCCUPANCY_SET_DURATION'
export const OCCUPANCY_SET_FROM = 'OCCUPANCY_SET_FROM'
export const OCCUPANCY_SET_LOADING = 'OCCUPANCY_SET_LOADING'


export function setGarage(garage) {
  return { type:  OCCUPANCY_SET_GARAGE,
    value: garage
  }
}

export function setClients(clients) {
  return { type:  OCCUPANCY_SET_CLIENTS,
    value: clients
  }
}

export function setClientId(id) {
  return dispatch => {
    dispatch({ type:  OCCUPANCY_SET_CLIENT_ID,
      value: id
    })
    dispatch(loadGarage())
  }
  // return  { type: OCCUPANCY_SET_CLIENT_ID
  //         , value: id
  //         }
}

export function setDuration(duration) {
  return dispatch => {
    dispatch({ type:  OCCUPANCY_SET_DURATION,
      value: duration
    })
    dispatch(loadGarage())
  }
  // return  { type: OCCUPANCY_SET_DURATION
  //         , value: duration
  //         }
}

export function setFrom(from) {
  return dispatch => {
    dispatch({ type:  OCCUPANCY_SET_FROM,
      value: from
    })
    dispatch(loadGarage())
  }
  // return  { type: OCCUPANCY_SET_FROM
  //         , value: from
  //         }
}

export function setLoading(value) {
  return { type: OCCUPANCY_SET_LOADING,
    value
  }
}


export function loadGarage() {
  return (dispatch, getState) => {
    const onGarageSuccess = response => {
      dispatch(setGarage(response.data.garage))
      // dispatch(setLoading(false))
    }

    const garage = getState().pageBase.garage
    const state = getState().occupancy

    garage && request(onGarageSuccess
      , GARAGE_DETAILS_QUERY
      , {
        id:         garage,
        from:       timeToUTC(state.from),
        to:         timeToUTC(state.from.clone().add(1, state.duration)),
        client_ids: state.client_ids
      }
    )
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
    dispatch(loadGarage())
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

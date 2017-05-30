import { request } from '../helpers/request'
import { t }       from '../modules/localization/localization'
import moment      from 'moment'
import _           from 'lodash'

import { GARAGE_DETAILS_QUERY } from '../queries/occupancy.queries'
import { toOccupancy }            from './pageBase.actions'

export const OCCUPANCY_SET_GARAGE     = 'OCCUPANCY_SET_GARAGE'
export const OCCUPANCY_SET_CLIENTS    = 'OCCUPANCY_SET_CLIENTS'
export const OCCUPANCY_SET_CLIENT_ID  = 'OCCUPANCY_SET_CLIENT_ID'
export const OCCUPANCY_SET_DURATION   = 'OCCUPANCY_SET_DURATION'
export const OCCUPANCY_SET_FROM       = 'OCCUPANCY_SET_FROM'


export function setGarage (garage){
  return  { type: OCCUPANCY_SET_GARAGE
          , value: garage
          }
}

export function setClients (clients){
  return  { type: OCCUPANCY_SET_CLIENTS
          , value: clients
          }
}

export function setClientId (id){
  return  { type: OCCUPANCY_SET_CLIENT_ID
          , value: id
          }
}

export function setDuration (duration){
  return  { type: OCCUPANCY_SET_DURATION
          , value: duration
          }
}
export function setFrom (from){
  return  { type: OCCUPANCY_SET_FROM
          , value: from
          }
}

export function loadGarage(){
  return (dispatch, getState) => {
    const onGarageSuccess = (response) => {
      response.data.garage.clients = response.data.garage.contracts.map(contract => contract.client)
      response.data.garage.clients.unshift({name:t(['occupancy', 'allClients']), id: undefined})
      dispatch(setClients(response.data.garage.clients))
      dispatch(setGarage(response.data.garage))
    }

    getState().pageBase.garage && request(onGarageSuccess, GARAGE_DETAILS_QUERY, {id: getState().pageBase.garage})
  }
}

export function initOccupancy () {
  return (dispatch, getState) => {
    // const onSuccess = (response) => {
    //   console.log(response);
    //   response.data.manageble_clients.unshift({name:t(['occupancy', 'allClients']), id: undefined})
    //   dispatch(setClients(response.data.manageble_clients))
    // }
    //
    // request(onSuccess, OCCUPANCY_INIT) // download clients
    dispatch(loadGarage())
  }
}

// =============================================================================
// occupancy actions
export function subtractDay () {
  return (dispatch, getState) => {
    dispatch(setFrom( moment(getState().occupancy.from).subtract(1,'day') ))
  }
}

export function addDay () {
  return (dispatch, getState) => {
    dispatch(setFrom( moment(getState().occupancy.from).add(1,'day') ))
  }
}

export function dayClick () {
  return (dispatch, getState) => {
    dispatch(setDuration( 'day' ))
  }
}

export function weekClick () {
  return (dispatch, getState) => {
    dispatch(setDuration( 'week' ))
  }
}

export function monthClick () {
  return (dispatch, getState) => {
    dispatch(setDuration( 'month' ))
  }
}

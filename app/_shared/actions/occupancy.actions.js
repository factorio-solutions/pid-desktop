import { request } from '../helpers/request'
import { t }       from '../modules/localization/localization'
import moment      from 'moment'

import { GARAGE_DETAILS_QUERY, OCCUPANCY_INIT } from '../queries/occupancy.queries'
import { toOccupancy }            from './pageBase.actions'

export const OCCUPANCY_SET_GARAGE     = 'OCCUPANCY_SET_GARAGE'
export const OCCUPANCY_SET_GARAGES    = 'OCCUPANCY_SET_GARAGES'
export const OCCUPANCY_SET_GARAGE_ID  = 'OCCUPANCY_SET_GARAGE_ID'
export const OCCUPANCY_SET_CLIENTS   = 'OCCUPANCY_SET_CLIENTS'
export const OCCUPANCY_SET_CLIENT_ID = 'OCCUPANCY_SET_CLIENT_ID'
export const OCCUPANCY_SET_DURATION   = 'OCCUPANCY_SET_DURATION'
export const OCCUPANCY_SET_FROM       = 'OCCUPANCY_SET_FROM'


export function setGarage (garage){
  return  { type: OCCUPANCY_SET_GARAGE
          , value: garage
          }
}

export function setGarages (garages){
  return  { type: OCCUPANCY_SET_GARAGES
          , value: garages
          }
}

export function setGarageId (id){
  return (dispatch, getState) => {
    dispatch({ type: OCCUPANCY_SET_GARAGE_ID
             , value: id
             })

    dispatch(loadGarage())
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
      dispatch(setGarage(response.data.garage))
    }

    getState().occupancy.garage_id && request(onGarageSuccess, GARAGE_DETAILS_QUERY, {id: getState().occupancy.garage_id})
  }
}

export function initOccupancy () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      response.data.manageble_clients.unshift({name:t(['occupancy', 'allClients']), id: undefined})
      dispatch(setClients(response.data.manageble_clients))
      const garages = response.data.user_garages.map( (user_garage) => { return user_garage.garage } )
      dispatch(setGarages(garages))

      getState().occupancy.garage_id == undefined ? dispatch(setGarageId(garages[0] && garages[0].id)) : dispatch(setGarageId(getState().occupancy.garage_id))
    }

    request(onSuccess, OCCUPANCY_INIT)
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

import { request } from '../helpers/request'
import { timeToUTC } from '../helpers/time'
import { t }       from '../modules/localization/localization'
import moment      from 'moment'

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
  return (dispatch, getState) => {
    dispatch({ type: OCCUPANCY_SET_DURATION
             , value: duration
             })
    dispatch(loadGarage())
  }
  // return  { type: OCCUPANCY_SET_DURATION
  //         , value: duration
  //         }
}
export function setFrom (from){
  return (dispatch, getState) => {
    dispatch({ type: OCCUPANCY_SET_FROM
             , value: from
             })
    dispatch(loadGarage())
  }
  // return  { type: OCCUPANCY_SET_FROM
  //         , value: from
  //         }
}

export function loadGarage(){
  return (dispatch, getState) => {
    const onGarageSuccess = (response) => {
      let clients = response.data.garage.contracts.reduce((acc, contract)=>{
        const currentClient = acc.find(client => client.id === contract.client.id)
        if (currentClient) {
          currentClient.contracts.push(contract)
        } else {
          acc.push({...contract.client, contracts: [contract]})
        }
        return acc
      }, [])

      clients.unshift({name:t(['occupancy', 'allReservations']), id: undefined})
      dispatch(setClients(clients))
      dispatch(setGarage(response.data.garage))
    }

    const garage = getState().pageBase.garage
    const state = getState().occupancy

    garage && request(onGarageSuccess
      , GARAGE_DETAILS_QUERY
      , { id: garage
        , from: timeToUTC(state.from)
        , to: timeToUTC(state.from.clone().add(1, state.duration))
        }
      )
  }
}

export function initOccupancy () {
  return (dispatch, getState) => {
    dispatch(loadGarage())
  }
}

// =============================================================================
// occupancy actions
export function subtract () {
  return (dispatch, getState) => {
    const duration = getState().occupancy.duration
    dispatch(setFrom( moment(getState().occupancy.from).subtract(1, duration) ))
  }
}

export function add () {
  return (dispatch, getState) => {
    const duration = getState().occupancy.duration
    dispatch(setFrom( moment(getState().occupancy.from).add(1, duration) ))
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

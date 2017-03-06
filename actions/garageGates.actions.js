import { request } from '../helpers/request'
import update      from 'react-addons-update'
import * as nav    from '../helpers/navigation'
import moment      from 'moment'
import {t}         from '../modules/localization/localization'

import { GET_GARAGE_GATE, CREATE_GROUP, DESTROY_GROUP } from '../queries/garageGates.queries'
import { toGarages, setError } from './pageBase.actions'

export const SET_GATE_PLACES_GARAGE = "SET_GATE_PLACES_GARAGE"
export const SET_GATE_PLACES_GATES  = "SET_GATE_PLACES_GATES"
export const SET_GATE_PLACES_GATE   = "SET_GATE_PLACES_GATE"
export const GATE_PLACES_RESET_FORM = "GATE_PLACES_RESET_FORM"


export function setGarage (value){
  return { type: SET_GATE_PLACES_GARAGE
         , value
         }
}

export function setGates (value){
  return { type: SET_GATE_PLACES_GATES
         , value
         }
}
export function setGate (value){
  return { type: SET_GATE_PLACES_GATE
         , value
         }
}

export function resetForm (){
  return  { type: GATE_PLACES_RESET_FORM }
}


export function initGates (id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setGates(response.data.garage.gates.map(gate=>{
        gate.place_count = gate.groups.length
        return gate
      })))
      dispatch(setGarage(response.data.garage))

      dispatch( toGarages() )
    }
    request(onSuccess, GET_GARAGE_GATE, { id: parseInt(id) })
  }
}


export function createConnection (place) {
  return (dispatch, getState) => {
    const state = getState().garageGates

    let groupable = state.gates.find(g => g.id==state.gate_id)

    let group = groupable.groups.find((g) => {return g.place_id === place.id})

    const onSuccess = (response) => {
      dispatch( initGates(state.garage.id) )
    }

    if (group){
      // remove group
      request( onSuccess
             , DESTROY_GROUP
             , { id: group.id }
             )
    } else {
      // create new group
      request( onSuccess
             , CREATE_GROUP
             , { place_id: place.id
               , group: { groupable_id:   state.gate_id
                        , groupable_type: 'Gate'
                        }
             })
    }
  }
}

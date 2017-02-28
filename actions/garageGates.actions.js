import { request } from '../helpers/request'
import update      from 'react-addons-update'
import * as nav    from '../helpers/navigation'
import moment      from 'moment'
import {t}         from '../modules/localization/localization'

import { GET_GARAGE_CLIENT, GET_GARAGE_CLIENT_UPDATE, CREATE_GROUP, DESTROY_GROUP, ADD_CLIENT } from '../queries/garageClients.queries'
import { toGarages, setError } from './pageBase.actions'

export const SET_CLIENTPLACES_GARAGE        = "SET_CLIENTPLACES_GARAGE"
export const SET_CLIENTPLACES_CLIENTS       = "SET_CLIENTPLACES_CLIENTS"
export const SET_CLIENTPLACES_CLIENT        = "SET_CLIENTPLACES_CLIENT"
export const SET_CLIENTPLACES_GATES         = "SET_CLIENTPLACES_GATES"
export const SET_CLIENTPLACES_GATE          = "SET_CLIENTPLACES_GATE"
export const SET_CLIENTPLACES_PRICINGS      = "SET_CLIENTPLACES_PRICINGS"
export const SET_CLIENTPLACES_PRICING       = "SET_CLIENTPLACES_PRICING"
export const SET_CLIENTPLACES_RENTS         = "SET_CLIENTPLACES_RENTS"
export const SET_CLIENTPLACES_RENT          = "SET_CLIENTPLACES_RENT"
export const SET_CLIENTPLACES_OVERVIEW      = "SET_CLIENTPLACES_OVERVIEW"
export const SET_CLIENTPLACES_FROM          = "SET_CLIENTPLACES_FROM"
export const SET_CLIENTPLACES_TO            = "SET_CLIENTPLACES_TO"
export const SET_CLIENTPLACES_NEW_CLIENT_ID = "SET_CLIENTPLACES_NEW_CLIENT_ID"
export const CLIENTPLACES_RESET_FORM        = "CLIENTPLACES_RESET_FORM"


export function setGarage (value){
  return { type: SET_CLIENTPLACES_GARAGE
         , value
         }
}

export function setClients (value){
  return { type: SET_CLIENTPLACES_CLIENTS
         , value
         }
}
export function setClient (value){
  return { type: SET_CLIENTPLACES_CLIENT
         , value
         }
}

export function setGates (value){
  return { type: SET_CLIENTPLACES_GATES
         , value
         }
}
export function setGate (value){
  return { type: SET_CLIENTPLACES_GATE
         , value
         }
}

export function setPricings (value){
  return { type: SET_CLIENTPLACES_PRICINGS
         , value
         }
}
export function setPricing (value){
  return { type: SET_CLIENTPLACES_PRICING
         , value
         }
}

export function setRents (value){
  return { type: SET_CLIENTPLACES_RENTS
         , value
         }
}
export function setRent (value){
  return { type: SET_CLIENTPLACES_RENT
         , value
         }
}

export function setOverview (value){
  return { type: SET_CLIENTPLACES_OVERVIEW
         , value
         }
}

export function setFrom (from){
  return (dispatch, getState) => {
    dispatch({ type: SET_CLIENTPLACES_FROM
            , value: from
            })
    if (moment(from, 'DD.MM.YYYY').isAfter(moment(getState().garageClients.to, 'DD.MM.YYYY'))){
      dispatch(setTo(moment(from, 'DD.MM.YYYY').format('DD.MM.YYYY')))
    }

    getState().garageClients.garage && dispatch(initClients(getState().garageClients.garage.id))
  }
}
export function setTo (to){
  return (dispatch, getState) => {
    dispatch({ type: SET_CLIENTPLACES_TO
            , value: to
            })
    if (moment(getState().garageClients.from, 'DD.MM.YYYY').isAfter(moment(to, 'DD.MM.YYYY'))){
      dispatch(setTo(moment(getState().garageClients.from, 'DD.MM.YYYY').format('DD.MM.YYYY')))
    }

    getState().garageClients.garage && dispatch(initClients(getState().garageClients.garage.id))
  }
}

export function setNewClientId(value){
  return { type: SET_CLIENTPLACES_NEW_CLIENT_ID
         , value
         }
}

export function resetForm (){
  return  { type: CLIENTPLACES_RESET_FORM }
}


export function initClients (id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setClients(response.data.garage.clients.map(client=>{
        client.place_count = client.groups.length
        return client
      })))
      dispatch(setGates(response.data.garage.gates.map(gate=>{
        gate.place_count = gate.groups.length
        return gate
      })))
      dispatch(setPricings(response.data.pricings))
      dispatch(setRents(response.data.rents))
      dispatch(setGarage(response.data.garage))

      dispatch( toGarages() )
    }
    request(onSuccess, GET_GARAGE_CLIENT, { id: parseInt(id) })
  }
}


export function createConnection (place) {
  return (dispatch, getState) => {
    const state = getState().garageClients

    let groupable = state.clients.find(c => c.id==state.client_id)
    || state.pricings.find(p => p.id==state.pricing_id)
    || state.rents.find(r => r.id==state.rent_id)
    || state.gates.find(g => g.id==state.gate_id)

    let group = groupable.groups.find((g) => {return g.place_id === place.id})

    const onSuccess = (response) => {
      dispatch( initClients(state.garage.id) )
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
               , group: { groupable_id: state.client_id || state.pricing_id || state.rent_id || state.gate_id
                        , groupable_type: state.client_id && 'Client' || state.pricing_id && 'Pricing' || state.rent_id && 'Rent' || state.gate_id && 'Gate'
                        }
             })
    }
  }
}

export function submitNewClient() {
  return (dispatch, getState) => {
    let state = getState().garageClients
    const onSuccess = (response) =>{
      if (response.data.client == null ){
        dispatch(setError(t(['garageManagement','clientNotFound'])))
      } else {
        dispatch(setClients(update(state.clients, {$push: [{...response.data.client, groups:[]}]} )))
        dispatch(setClient(+state.new_client_id))
        nav.back()
      }
    }

    request( onSuccess
           , ADD_CLIENT
           , { id: +state.new_client_id }
           )
  }
}

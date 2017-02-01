import { request } from '../helpers/request'
import update      from 'react-addons-update'
import moment      from 'moment'

import { GET_GARAGE_CLIENT, GET_GARAGE_CLIENT_UPDATE, CREATE_GARAGE_CLIENT, REMOVE_GARAGE_CLIENT } from '../queries/garageClients.queries'
import { toGarages } from './pageBase.actions'

export const SET_CLIENTPLACES_CLIENTS = "SET_CLIENTPLACES_CLIENTS"
export const SET_CLIENTPLACES_GARAGE   = "SET_CLIENTPLACES_GARAGE"
export const SET_CLIENTPLACES_FLOOR    = "SET_CLIENTPLACES_FLOOR"
export const SET_CLIENTPLACES_CLIENT  = "SET_CLIENTPLACES_CLIENT"
export const SET_CLIENTPLACES_FLOORS   = "SET_CLIENTPLACES_FLOORS"
export const SET_CLIENTPLACES_FROM     = "SET_CLIENTPLACES_FROM"
export const SET_CLIENTPLACES_TO       = "SET_CLIENTPLACES_TO"
export const CLIENTPLACES_RESET_FORM   = "CLIENTPLACES_RESET_FORM"


export function setClients (clients){
  return  { type: SET_CLIENTPLACES_CLIENTS
          , value: clients
          }
}

export function setClient (client){
  return (dispatch, getState) => {
    dispatch({ type: SET_CLIENTPLACES_CLIENT
             , value: client
             })
    dispatch( preparePlaces() )
  }
}

export function setGarage (garage){
  return  { type: SET_CLIENTPLACES_GARAGE
          , value: garage
          }
}

export function setFloor (floor){
  return  { type: SET_CLIENTPLACES_FLOOR
          , value: floor
          }
}

export function setFloors (floors){
  return  { type: SET_CLIENTPLACES_FLOORS
          , value: floors
          }
}

export function resetForm (){
  return  { type: CLIENTPLACES_RESET_FORM }
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


export function initClients (id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      response.data.manageble_clients = clientsPlaceCount (response.data.manageble_clients, response.data.garage)
      dispatch( setClients(response.data.manageble_clients) )
      dispatch( setGarage(response.data.garage) )
      dispatch( setFloor(0) )
      dispatch( preparePlaces() )
      // dispatch( setClient(undefined) )

      dispatch( toGarages() )
    }
    request(onSuccess, GET_GARAGE_CLIENT, {id: parseInt(id), "valid_from": getState().garageClients.from, "invalid_from": getState().garageClients.to == "" ? '31.12.9999' :getState().garageClients.to})
  }
}

function clientsPlaceCount (clients, garage){
  return clients.map(function(client) { // get number of places for each client
    client.place_count = garage.floors.map(function(floor) {
      return floor.places.filter(function(place){
        return place.client_places_interval[0] && place.client_places_interval[0].client_id == client.id
      }).length
    }).reduce(function(a, b) {return a + b }, 0)
    return client
  })
}

export function preparePlaces() {
    return (dispatch, getState) => {
      var state = getState().garageClients
      var availableFloors = state.garage.floors.map(function(floor){
        floor['free_places'] = floor.places.filter(function(place){
          return place.client_places_interval.length == 0
        })
        floor['client_places_interval'] = floor.places.filter(function(place){
          return place.client_places_interval.find(function(client_place){return client_place.client_id == state.client_id}) != undefined
        })
        return floor
      })
      dispatch(setFloors(availableFloors))
    }
}


export function createConnection (place) {
  return (dispatch, getState) => {
    const state = getState().garageClients

    const onSuccess = (response) => {
      const onGarageLoad = (response) => {
        dispatch( setGarage(response.data.garage) )
        dispatch( preparePlaces() )
        dispatch( setClients(clientsPlaceCount (state.clients, response.data.garage)) )
      }

      request(onGarageLoad, GET_GARAGE_CLIENT, {id: state.garage.id, "valid_from": state.from, "invalid_from": state.to == "" ? '31.12.9999' : state.to})
    }


    if (place.client_places_interval.find(function(client_place){return client_place.client_id == state.client_id})==undefined){
      // create connection
      request(onSuccess
             , CREATE_GARAGE_CLIENT
             , { place_id: place.id
               , client_id: state.client_id
               , "client_place": {
                  "valid_from": state.from,
                  // "invalid_from": state.to
                  "invalid_from": state.to == "" ? '31.12.9999' : state.to
                }
              }
            )
    } else {
      // remove connection
      request(onSuccess
             , REMOVE_GARAGE_CLIENT
             , { place_id: place.id
               , client_id: state.client_id
               , "client_place": {
                  "valid_from": state.from,
                  // "invalid_from": state.to
                  "invalid_from": state.to == "" ? '31.12.9999' : state.to
               }
             }
           )
    }
  }
}

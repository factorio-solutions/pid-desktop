import { request } from '../helpers/request'
import update      from 'react-addons-update'
import moment      from 'moment'

import { GET_GARAGE_ACCOUNT, GET_GARAGE_ACCOUNT_UPDATE, CREATE_GARAGE_ACCOUNT, REMOVE_GARAGE_ACCOUNT } from '../queries/garageAccounts.queries'
import { toGarages } from './pageBase.actions'

export const SET_ACCOUNTPLACES_ACCOUNTS = "SET_ACCOUNTPLACES_ACCOUNTS"
export const SET_ACCOUNTPLACES_GARAGE   = "SET_ACCOUNTPLACES_GARAGE"
export const SET_ACCOUNTPLACES_FLOOR    = "SET_ACCOUNTPLACES_FLOOR"
export const SET_ACCOUNTPLACES_ACCOUNT  = "SET_ACCOUNTPLACES_ACCOUNT"
export const SET_ACCOUNTPLACES_FLOORS   = "SET_ACCOUNTPLACES_FLOORS"
export const SET_ACCOUNTPLACES_FROM     = "SET_ACCOUNTPLACES_FROM"
export const SET_ACCOUNTPLACES_TO       = "SET_ACCOUNTPLACES_TO"
export const ACCOUNTPLACES_RESET_FORM   = "ACCOUNTPLACES_RESET_FORM"


export function setAccounts (accounts){
  return  { type: SET_ACCOUNTPLACES_ACCOUNTS
          , value: accounts
          }
}

export function setAccount (account){
  return (dispatch, getState) => {
    dispatch({ type: SET_ACCOUNTPLACES_ACCOUNT
             , value: account
             })
    dispatch( preparePlaces() )
  }
}

export function setGarage (garage){
  return  { type: SET_ACCOUNTPLACES_GARAGE
          , value: garage
          }
}

export function setFloor (floor){
  return  { type: SET_ACCOUNTPLACES_FLOOR
          , value: floor
          }
}

export function setFloors (floors){
  return  { type: SET_ACCOUNTPLACES_FLOORS
          , value: floors
          }
}

export function resetForm (){
  return  { type: ACCOUNTPLACES_RESET_FORM }
}


export function setFrom (from){
  return (dispatch, getState) => {
    dispatch({ type: SET_ACCOUNTPLACES_FROM
            , value: from
            })
    if (moment(from, 'DD.MM.YYYY').isAfter(moment(getState().garageAccounts.to, 'DD.MM.YYYY'))){
      dispatch(setTo(moment(from, 'DD.MM.YYYY').format('DD.MM.YYYY')))
    }

    getState().garageAccounts.garage && dispatch(initAccounts(getState().garageAccounts.garage.id))
  }
}

export function setTo (to){
  return (dispatch, getState) => {
    dispatch({ type: SET_ACCOUNTPLACES_TO
            , value: to
            })
    if (moment(getState().garageAccounts.from, 'DD.MM.YYYY').isAfter(moment(to, 'DD.MM.YYYY'))){
      dispatch(setTo(moment(getState().garageAccounts.from, 'DD.MM.YYYY').format('DD.MM.YYYY')))
    }

    getState().garageAccounts.garage && dispatch(initAccounts(getState().garageAccounts.garage.id))
  }
}


export function initAccounts (id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      response.data.manageble_accounts = accountsPlaceCount (response.data.manageble_accounts, response.data.garage)
      dispatch( setAccounts(response.data.manageble_accounts) )
      dispatch( setGarage(response.data.garage) )
      dispatch( setFloor(0) )
      dispatch( preparePlaces() )
      // dispatch( setAccount(undefined) )

      dispatch( toGarages() )
    }
    request(onSuccess, GET_GARAGE_ACCOUNT, {id: parseInt(id), "valid_from": getState().garageAccounts.from, "invalid_from": getState().garageAccounts.to == "" ? '31.12.9999' :getState().garageAccounts.to})
  }
}

function accountsPlaceCount (accounts, garage){
  return accounts.map(function(account) { // get number of places for each account
    account.place_count = garage.floors.map(function(floor) {
      return floor.places.filter(function(place){
        return place.account_places_interval[0] && place.account_places_interval[0].account_id == account.id
      }).length
    }).reduce(function(a, b) {return a + b }, 0)
    return account
  })
}

export function preparePlaces() {
    return (dispatch, getState) => {
      var state = getState().garageAccounts
      var availableFloors = state.garage.floors.map(function(floor){
        floor['free_places'] = floor.places.filter(function(place){
          return place.account_places_interval.length == 0
        })
        floor['account_places_interval'] = floor.places.filter(function(place){
          return place.account_places_interval.find(function(account_place){return account_place.account_id == state.account_id}) != undefined
        })
        return floor
      })
      dispatch(setFloors(availableFloors))
    }
}


export function createConnection (place) {
  return (dispatch, getState) => {
    const state = getState().garageAccounts

    const onSuccess = (response) => {
      const onGarageLoad = (response) => {
        dispatch( setGarage(response.data.garage) )
        dispatch( preparePlaces() )
        dispatch( setAccounts(accountsPlaceCount (state.accounts, response.data.garage)) )
      }

      request(onGarageLoad, GET_GARAGE_ACCOUNT, {id: state.garage.id, "valid_from": state.from, "invalid_from": state.to == "" ? '31.12.9999' : state.to})
    }


    if (place.account_places_interval.find(function(account_place){return account_place.account_id == state.account_id})==undefined){
      // create connection
      request(onSuccess
             , CREATE_GARAGE_ACCOUNT
             , { place_id: place.id
               , account_id: state.account_id
               , "account_place": {
                  "valid_from": state.from,
                  // "invalid_from": state.to
                  "invalid_from": state.to == "" ? '31.12.9999' : state.to
                }
              }
            )
    } else {
      // remove connection
      request(onSuccess
             , REMOVE_GARAGE_ACCOUNT
             , { place_id: place.id
               , account_id: state.account_id
               , "account_place": {
                  "valid_from": state.from,
                  // "invalid_from": state.to
                  "invalid_from": state.to == "" ? '31.12.9999' : state.to
               }
             }
           )
    }
  }
}

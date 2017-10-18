import update   from 'immutability-helper'
import * as nav from '../helpers/navigation'
import moment   from 'moment'

import { request }                           from '../helpers/request'
import { MOMENT_DATETIME_FORMAT, timeToUTC } from '../helpers/time'
import { t }                                 from '../modules/localization/localization'
import { setError }                          from './pageBase.actions'

import { GET_RENTS }                     from '../queries/admin.finance.queries.js'
import { GARAGE_CONTRACTS }              from '../queries/clients.queries.js'
import { GET_GARAGE_CLIENT, ADD_CLIENT, GET_CURRENCIES, CREATE_CONTRACT, GET_CONTRACT_DETAILS, UPDATE_CONTRACT } from '../queries/newContract.queries.js'


export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_ID    = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_ID'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENTS        = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENTS'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT         = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_ADD_CLIENT     = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_ADD_CLIENT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT_TOKEN   = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT_TOKEN'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_RENTS          = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_RENST'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_RENT           = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_RENT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_NEW_RENT       = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_NEW_RENT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_PRICE = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_PRICE'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCIES     = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCIES'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCY       = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCY'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_FROM           = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_FROM'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_TO             = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_TO'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_GARAGE         = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_GARAGE'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_PLACES         = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_PLACES'
export const ADMIN_CLIENTS_NEW_CONTRACT_TOGGLE_HIGHLIGHT   = 'ADMIN_CLIENTS_NEW_CONTRACT_TOGGLE_HIGHLIGHT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_INDEFINITLY    = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_INDEFINITLY'
export const ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM         = 'ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM'


export function setContractId (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_ID
         , value
         }
}

export function setClients (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENTS
         , value
         }
}

export function setClient (id) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT
         , value: id
         }
}

export function setAddClient (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_ADD_CLIENT
         , value
         }
}

export function setClientToken (value, valid) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT_TOKEN
         , value
         }
}

export function setRents (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_RENTS
         , value
         }
}

export function setRent (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_RENT
         , value
         }
}

export function setNewRents (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_NEW_RENT
         , value
         }
}

export function setContractPrice (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_PRICE
         , value
         }
}

export function setCurrencies (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCIES
         , value
         }
}

export function setCurrency (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCY
         , value
         }
}

export function setFrom (value) {
  return (dispatch, getState) => {
    let fromValue = moment(value, MOMENT_DATETIME_FORMAT).startOf('day')
    const now = moment(moment()).startOf('day')

    if (getState().newContract.contract_id === undefined && fromValue.diff(now, 'minutes') < 0){ // cannot create reservations in the past
      fromValue = now
    }

    if (moment(getState().newContract.to, MOMENT_DATETIME_FORMAT).isValid() &&
        moment(getState().newContract.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < 0) {
      dispatch(setTo(fromValue.clone().endOf('day').format(MOMENT_DATETIME_FORMAT)))
    }

    dispatch({ type: ADMIN_CLIENTS_NEW_CONTRACT_SET_FROM
             , value: fromValue.format(MOMENT_DATETIME_FORMAT)
             })

    getState().newContract.garage && dispatch(getGarage(getState().newContract.garage.id, getState().newContract.contract_id))
  }
}

export function setTo (value) {
  return (dispatch, getState) => {
    if (value === ''){ // can be empty value
      dispatch({ type: ADMIN_CLIENTS_NEW_CONTRACT_SET_TO
               , value
               })
    } else {
      let toValue = moment(value, MOMENT_DATETIME_FORMAT).endOf('day')
      let fromValue = moment(getState().newContract.from, MOMENT_DATETIME_FORMAT)

      if (toValue.diff(fromValue, 'minutes') <= 0) {
        toValue = fromValue.endOf('day')
      }

      dispatch ({ type: ADMIN_CLIENTS_NEW_CONTRACT_SET_TO
                , value: toValue.format(MOMENT_DATETIME_FORMAT)
                })
    }

    getState().newContract.garage && dispatch(getGarage(getState().newContract.garage.id, getState().newContract.contract_id))
  }
}

export function setGarage (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_GARAGE
         , value
         }
}

export function setPlaces (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_PLACES
         , value
         }
}


export function toggleHighlight () {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_TOGGLE_HIGHLIGHT }
}

export function setIndefinitly (value) {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_INDEFINITLY
    , value
  }
}

export function toggleIndefinitly () {
  return (dispatch, getState) => {
    dispatch(setIndefinitly(!getState().newContract.indefinitly))
  }
}

export function eraseForm () {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM }
}


export function initContract(id){
  return (dispatch, getState) => {
    dispatch(setContractId(id))

    const onRentsSuccess = (response) => {
      dispatch(setRents(response.data.rents))
      if (response.data.rents.length == 1) {
        dispatch(setRent(response.data.rents[0]))
      }
    }

    const onClientsSuccess = (response) => {
      const clients = response.data.garage.contracts.reduce((arr, contracts) => {
        if (arr.find(client => client.id === contracts.client.id) === undefined) {
          arr.push(contracts.client)
        }
        return arr
      }, getState().clients.clients || []) // will find unique clients, start with clients from clients page

      dispatch(setClients(clients))
      if (clients.length == 1) { dispatch(setClient(clients[0].id)) }
    }

    const onDetailsSuccess = (response) => {
      const to = moment(response.data.contract.to)
      dispatch(setFrom(moment(response.data.contract.from).format(MOMENT_DATETIME_FORMAT)))
      if (to.year() === 9999) { // then is infinite
        dispatch(setIndefinitly(true))
        // dispatch(setTo(response.data.contract.to ? moment(response.data.contract.to).format(MOMENT_DATETIME_FORMAT) : ''))
      } else {
        dispatch(setIndefinitly(false))
        dispatch(setTo(response.data.contract.to ? moment(response.data.contract.to).format(MOMENT_DATETIME_FORMAT) : ''))
      }
      dispatch(getGarage(response.data.contract.garage.id, id))
      dispatch(setClient(response.data.contract.client.id))
      dispatch(setRent(response.data.contract.rent))
      dispatch(setPlaces(response.data.contract.places))
    }

    const garage_id = getState().pageBase.garage
    if (!id) dispatch(getGarage(garage_id)) // if id, then i have to download garage from contract, not this one
    request(onRentsSuccess, GET_RENTS)
    garage_id && request(onClientsSuccess, GARAGE_CONTRACTS, {id: garage_id})
    if (id) request(onDetailsSuccess, GET_CONTRACT_DETAILS, {id: +id})
  }
}

export function getGarage (garage_id, contract_id) {
  return (dispatch, getState) => {
    const state = getState().newContract

    const onSuccess = (response) => {
      response.data.garage.floors = response.data.garage.floors.map(floor => {
        floor.places = floor.places.map((place) => {
          return {...place, available: floor.contractable_places.find(p=>p.id === place.id) !== undefined }
        })
        return floor
      })

      dispatch(setGarage(response.data.garage))
    }

    request( onSuccess
           , GET_GARAGE_CLIENT
           , { garage_id
             , from: timeToUTC(state.from)
             , to :  timeToUTC(state.to ? state.to : moment(state.from).endOf('day'))
             , contract_id: +contract_id
             }
           )
  }
}

export function toggleAddClient () {
  return (dispatch, getState) => {
    dispatch(setAddClient(!getState().newContract.addClient))
  }
}

export function toggleNewRent() {
  return (dispatch, getState) => {
    dispatch(setNewRents(!getState().newContract.newRent))


    if (getState().newContract.currencies.length === 0){
      const onSuccess = (response) => {
        dispatch(setCurrencies(response.data.currencies))
      }
      request(onSuccess, GET_CURRENCIES)
    }
  }
}

export function addClient(){
  return (dispatch, getState) => {
    const onSuccess = (response) =>{
      if (response.data.client_by_token == null ){
        dispatch(setError(t(['newContract','clientNotFound'])))
      } else {
        if (getState().newContract.clients.find(client => client.id === response.data.client_by_token.id) === undefined){
          dispatch(setClients(update(getState().newContract.clients, {$push: [response.data.client_by_token]} )))
        }
        dispatch(setClient(response.data.client_by_token.id))
        dispatch(toggleAddClient())
      }
    }

    request( onSuccess
           , ADD_CLIENT
           , { token: getState().newContract.client_token }
           )
  }
}

export function selectPlace (place){
  return (dispatch, getState) => {
    if (place.selected){
      dispatch(removePlace(getState().newContract.places.findIndex(p => p.id === place.id)))
    } else {
      dispatch(setPlaces(update(getState().newContract.places, {$push: [place]} )))
    }
  }
}

export function removePlace (index){
  return (dispatch, getState) => {
    const places = getState().newContract.places
    dispatch(setPlaces( places.slice(0,index).concat(places.slice(index + 1)) ))
  }
}

export function submitNewContract (id){
  return (dispatch, getState) => {
    const state = getState().newContract
    const client = state.clients.find(cli => cli.id === state.client_id)
    let variables = { contract: { client_id: client.id
                                , contract_places: state.places.map(place => {return {place_id: place.id}})
                                , from: timeToUTC(state.from)
                                , to:   state.indefinitly ? null : timeToUTC(state.to)
                                }
                    }

    if (state.newRent){
      variables.contract = {...variables.contract
                           , rent: { currency_id: state.currency_id
                                   , price: state.price/state.places.length
                                   }
                           }
    } else {
      variables.contract = { ...variables.contract
                           , rent_id: state.rent.id
                           }
    }

    const onSuccess = (response) => {
      nav.to(`/${getState().pageBase.garage}/admin/clients`)
      dispatch(eraseForm())
    }

    if (id) { // edit contract
      request(onSuccess, UPDATE_CONTRACT, {...variables, id: +id})
    }else { // submit new contract
      const onSuccess = (response) => {
        nav.to(`/${getState().pageBase.garage}/admin/clients`)
        dispatch(eraseForm())
      }

      request(onSuccess, CREATE_CONTRACT, variables)
    }
  }
}

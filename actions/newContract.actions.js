import update   from 'react-addons-update'
import * as nav from '../helpers/navigation'
import moment   from 'moment'

import { request }  from '../helpers/request'
import {t}          from '../modules/localization/localization'
import { setError } from './pageBase.actions'

import { GET_RENTS }                     from '../queries/admin.finance.queries.js'
import { GET_CLIENTS }                   from '../queries/clients.queries.js'
import { GET_GARAGE_CLIENT, ADD_CLIENT, GET_CURRENCIES, CREATE_CONTRACT, GET_CONTRACT_DETAILS, UPDATE_CONTRACT } from '../queries/newContract.queries.js'

const MOMENT_DATETIME_FORMAT = "DD.MM.YYYY HH:mm"

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
export const ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM         = 'ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM'


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

    if (fromValue.diff(now, 'minutes') < 0){ // cannot create reservations in the past
      fromValue = now
    }

    if (moment(getState().newContract.to, MOMENT_DATETIME_FORMAT).isValid() &&
        moment(getState().newContract.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < 0) {
      dispatch(setTo(fromValue.clone().endOf('day').format(MOMENT_DATETIME_FORMAT)))
    }

    dispatch({ type: ADMIN_CLIENTS_NEW_CONTRACT_SET_FROM
             , value: fromValue.format(MOMENT_DATETIME_FORMAT)
             })
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
      // return { type: ADMIN_CLIENTS_NEW_CONTRACT_SET_TO
      //   , value: value ==='' ? '' : moment(value, MOMENT_DATETIME_FORMAT).endOf('day').format(MOMENT_DATETIME_FORMAT)
      // }
    }
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

export function eraseForm () {
  return { type: ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM }
}


export function initContract(id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      response.data.garage.floors = response.data.garage.floors.map(floor => {
        floor.places = floor.places.map((place) => {
          place.noContract = response.data.garage.contracts
          .filter(contract => contract.id !== +id) // not current contract
          .find(contract => {
            return contract.places.find((contractPlace) => contractPlace.id === place.id) !== undefined
          }) === undefined
          return place
        })
        return floor
      })

      dispatch(setGarage(response.data.garage))
    }

    const onRentsSuccess = (response) => {
      dispatch(setRents(response.data.rents))
      if (response.data.rents.length == 1) {
        dispatch(setRent(response.data.rents[0].id))
      }
    }

    const onClientsSuccess = (response) => {
      const clients = response.data.client_users.reduce((arr, client_user) => {
        if (arr.find(client => client.id === client_user.client_id) === undefined) {
          arr.push(client_user.client)
        }
        return arr
      }, []) // will find unique clients

      dispatch(setClients(clients))
      if (clients.length == 1) { dispatch(setClient(clients[0].id)) }
    }

    const onDetailsSuccess = (response) => {
      dispatch(setFrom(moment(response.data.contract.from).format(MOMENT_DATETIME_FORMAT)))
      dispatch(setTo(response.data.contract.to ? moment(response.data.contract.to).format(MOMENT_DATETIME_FORMAT) : ''))
      request(onSuccess, GET_GARAGE_CLIENT, { id: response.data.contract.garage.id })
      dispatch(setClient(response.data.contract.client.id))
      dispatch(setRent(response.data.contract.rent.id))
      dispatch(setPlaces(response.data.contract.places))
    }

    if (!id) request(onSuccess, GET_GARAGE_CLIENT, { id: getState().pageBase.garage }) // if id, then i have to download garage from contract, not this one
    request(onRentsSuccess, GET_RENTS)
    request(onClientsSuccess, GET_CLIENTS)
    if (id) request(onDetailsSuccess, GET_CONTRACT_DETAILS, {id: +id})
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
                                , from: state.from
                                , to: state.to
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
                           , rent_id: state.rent_id
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

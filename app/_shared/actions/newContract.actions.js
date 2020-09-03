import update from 'immutability-helper'
import moment from 'moment'
import { batchActions } from 'redux-batched-actions'

import request                           from '../helpers/request'
import requestPromise                        from '../helpers/requestPromise'
import { MOMENT_DATETIME_FORMAT, timeToUTC } from '../helpers/time'
import * as nav                              from '../helpers/navigation'
import actionFactory                         from '../helpers/actionFactory'
import { t }                                 from '../modules/localization/localization'
import { setError }                          from './pageBase.actions'

import { GET_RENTS }                     from '../queries/admin.finance.queries.js'
import { GARAGE_CONTRACTS }              from '../queries/clients.queries.js'
import {
  GET_GARAGE_CLIENT,
  ADD_CLIENT,
  GET_CURRENCIES,
  CREATE_CONTRACT,
  GET_CONTRACT_DETAILS,
  UPDATE_CONTRACT
} from '../queries/newContract.queries.js'


export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_ID = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_ID'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENTS = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENTS'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_ADD_CLIENT = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_ADD_CLIENT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT_TOKEN = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT_TOKEN'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_RENTS = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_RENST'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_RENT = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_RENT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_NEW_RENT = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_NEW_RENT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_PRICE = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_PRICE'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCIES = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCIES'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCY = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCY'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_FROM = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_FROM'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_TO = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_TO'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_GARAGE = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_GARAGE'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_PLACES = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_PLACES'
export const ADMIN_CLIENTS_NEW_CONTRACT_TOGGLE_HIGHLIGHT = 'ADMIN_CLIENTS_NEW_CONTRACT_TOGGLE_HIGHLIGHT'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_INDEFINITLY = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_INDEFINITLY'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_SECURITY_INTERVAL = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_SECURITY_INTERVAL'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_PLACES = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_PLACES'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_INDEFINITLY = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_INDEFINITLY'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_TO = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_TO'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS_MODAL = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS_MODAL'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS'
export const ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM = 'ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM'
export const ADMIN_CLIENTS_NEW_CONTRACT_SET_GENERATE_INVOICE = 'ADMIN_CLIENTS_NEW_CONTRACT_SET_GENERATE_INVOICE'


export const setContractId = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_ID)
export const setClients = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENTS)
export const setClient = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT)
export const setAddClient = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_ADD_CLIENT)
export const setClientToken = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_CLIENT_TOKEN)
export const setRents = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_RENTS)
export const setRent = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_RENT)
export const setNewRents = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_NEW_RENT)
export const setContractPrice = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_CONTRACT_PRICE)
export const setCurrencies = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCIES)
export const setCurrency = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_CURRENCY)
export const setGarage = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_GARAGE)
export const setPlaces = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_PLACES)
export const toggleHighlight = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_TOGGLE_HIGHLIGHT)
export const setIndefinitly = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_INDEFINITLY)
export const setOriginalPlaces = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_PLACES)
export const setOriginalIndefinitly = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_INDEFINITLY)
export const setOriginalTo = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_ORIGINAL_TO)
export const setRemoveReservationsModal = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS_MODAL)
export const setRemoveReservations = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_REMOVE_RESERVATIONS)
export const eraseForm = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_ERASE_FORM)
export const setGenerateInvoice = actionFactory(ADMIN_CLIENTS_NEW_CONTRACT_SET_GENERATE_INVOICE)

export function setSecurityInterval(value) {
  return {
    type:  ADMIN_CLIENTS_NEW_CONTRACT_SET_SECURITY_INTERVAL,
    value: parseInt(value, 10)
  }
}

export function setFrom(value, refreshGarage = true) {
  return (dispatch, getState) => {
    let fromValue = moment(value, MOMENT_DATETIME_FORMAT).startOf('day')
    const now = moment().startOf('day')

    if (getState().newContract.contract_id === undefined && fromValue.diff(now, 'minutes') < 0) { // cannot create reservations in the past
      fromValue = now
    }

    if (moment(getState().newContract.to, MOMENT_DATETIME_FORMAT).isValid()
        && moment(getState().newContract.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < 0) {
      dispatch(setTo(fromValue.clone().endOf('day').format(MOMENT_DATETIME_FORMAT), refreshGarage))
    }

    dispatch({
      type:  ADMIN_CLIENTS_NEW_CONTRACT_SET_FROM,
      value: fromValue.format(MOMENT_DATETIME_FORMAT)
    })

    refreshGarage && getState().newContract.garage && dispatch(getGarage(getState().newContract.garage.id))
  }
}

export function setTo(value, refreshGarage = true) {
  return (dispatch, getState) => {
    if (value === '') { // can be empty value
      dispatch({
        type: ADMIN_CLIENTS_NEW_CONTRACT_SET_TO,
        value
      })
    } else {
      let toValue = moment(value, MOMENT_DATETIME_FORMAT).endOf('day')
      const fromValue = moment(getState().newContract.from, MOMENT_DATETIME_FORMAT)

      if (toValue.diff(fromValue, 'minutes') <= 0) {
        toValue = fromValue.endOf('day')
      }

      dispatch({
        type:  ADMIN_CLIENTS_NEW_CONTRACT_SET_TO,
        value: toValue.format(MOMENT_DATETIME_FORMAT)
      })
    }

    refreshGarage && getState().newContract.garage && dispatch(getGarage(getState().newContract.garage.id))
  }
}

export function toggleIndefinitly() {
  return (dispatch, getState) => {
    dispatch(setIndefinitly(!getState().newContract.indefinitly))
  }
}


export function initContract(id) {
  return async (dispatch, getState) => {
    dispatch(setContractId(id))
    const garageId = getState().pageBase.garage
    if (!id) {
      dispatch(setFrom(moment().startOf('day'), false))
      dispatch(setTo(moment().endOf('day'), false))
      // If id, then i have to download garage from contract, not this one.
      dispatch(getGarage(garageId))
    }
    const { rents } = await requestPromise(GET_RENTS)

    dispatch(setRents(rents))
    if (rents.length === 1) {
      dispatch(setRent(rents[0]))
    }

    const clientsPromise = garageId && requestPromise(GARAGE_CONTRACTS, { id: garageId })
    const detailsPromise = id && requestPromise(GET_CONTRACT_DETAILS, { id: +id })

    const [ clientsData, detailsData ] = [
      await clientsPromise,
      await detailsPromise
    ]

    // Will find unique clients, start with clients from clients page.
    const clients = clientsData && clientsData.garage.contracts.reduce((arr, contracts) => {
      if (arr.find(client => client.id === contracts.client.id) === undefined) {
        arr.push(contracts.client)
      }
      return arr
    }, getState().clients.clients || [])

    dispatch(setClients(clients || []))
    if (clients && clients.length === 1) { dispatch(setClient(clients[0].id)) }

    if (detailsData) {
      const infiniteYear = 9999

      const to = moment(detailsData.contract.to)
      const isIndefinite = to.year() === infiniteYear

      const fromString = moment(detailsData.contract.from).format(MOMENT_DATETIME_FORMAT)
      const toString = detailsData.contract.to ? to.format(MOMENT_DATETIME_FORMAT) : ''

      dispatch(setFrom(fromString, false))
      dispatch(setTo(toString, false))
      dispatch(batchActions([
        setIndefinitly(isIndefinite),
        setOriginalIndefinitly(isIndefinite),
        setOriginalTo(toString)
      ], 'ADMIN_CLIENTS_NEW_CONTRACT_INIT_CONTRACT_BATCH_1'))

      if (!isIndefinite) {
        dispatch(setTo(toString, false))
      }

      dispatch(getGarage(detailsData.contract.garage.id))

      dispatch(batchActions([
        setPlaces(detailsData.contract.places),
        setClient(detailsData.contract.client.id),
        setRent(detailsData.contract.rent),
        setPlaces(detailsData.contract.places),
        setOriginalPlaces(detailsData.contract.places),
        setSecurityInterval(detailsData.contract.security_interval),
        setGenerateInvoice(detailsData.contract.generate_invoice)
      ], 'ADMIN_CLIENTS_NEW_CONTRACT_INIT_CONTRACT_BATCH_2'))
    }

    // if (garageId) request(onClientsSuccess, GARAGE_CONTRACTS, { id: garageId })
    // if (id) request(onDetailsSuccess, GET_CONTRACT_DETAILS, { id: +id })
  }
}

export function getGarage(garageId) {
  return async (dispatch, getState) => {
    const state = getState().newContract

    const { garage } = await requestPromise(GET_GARAGE_CLIENT, {
      garage_id:   +garageId,
      begins_at:   state.from,
      ends_at:     state.to,
      client_id:   +state.client_id,
      contract_id: +state.contract_id
    })

    const { places: statePlaces, contract_id: contractId } = getState().newContract
    // It is like that because removePlace() work weird in map callback bellow
    let places = statePlaces
    dispatch(setGarage({
      ...garage,
      floors: garage.floors.map(floor => ({
        ...floor,
        places: floor.places.map(place => {
          const available = floor.contractable_places.some(p => p.id === place.id)
          // !state.contract_id is here for legacy reasons
          // when a client has more then one contract at the same time.
          if (!available && !contractId) {
            places = places.filter(p => p.id !== place.id)
          }
          return {
            ...place,
            available,
            // contracts: response.garage.clients.filter(client => client.contracts.find(contract => contract.places.find(p => p.id === place.id))),
            contracts: garage.clients.reduce((acc, client) => {
              const contracts = client.contracts
                .filter(contract => contract.places.some(p => p.id === place.id))
                .map(contract => ({ ...contract, client }))
              return acc.concat(contracts)
            }, [])
          }
        })
      }))
    }))

    dispatch(setPlaces(places))
  }
}

export function toggleAddClient() {
  return (dispatch, getState) => {
    dispatch(setAddClient(!getState().newContract.addClient))
  }
}

export function toggleNewRent() {
  return (dispatch, getState) => {
    dispatch(setNewRents(!getState().newContract.newRent))


    if (getState().newContract.currencies.length === 0) {
      const onSuccess = response => {
        dispatch(setCurrencies(response.data.currencies))
      }
      request(onSuccess, GET_CURRENCIES)
    }
  }
}

export function addClient() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      if (response.data.client_by_token == null) {
        dispatch(setError(t([ 'newContract', 'clientNotFound' ])))
      } else {
        if (getState().newContract.clients.find(client => client.id === response.data.client_by_token.id) === undefined) {
          dispatch(setClients(update(getState().newContract.clients, { $push: [ response.data.client_by_token ] })))
        }
        dispatch(setClient(response.data.client_by_token.id))
        dispatch(toggleAddClient())
      }
    }

    request(
      onSuccess,
      ADD_CLIENT,
      { token: getState().newContract.client_token }
    )
  }
}

export function selectPlace(place) {
  return (dispatch, getState) => {
    if (place.selected) {
      dispatch(removePlace(getState().newContract.places.findIndex(p => p.id === place.id)))
    } else {
      dispatch(setPlaces(update(getState().newContract.places, { $push: [ place ] })))
    }
  }
}

export function removePlace(index) {
  return (dispatch, getState) => {
    const places = getState().newContract.places
    dispatch(setPlaces(places.slice(0, index).concat(places.slice(index + 1))))
  }
}

export function submitNewContract(id) {
  return (dispatch, getState) => {
    const state = getState().newContract
    const client = state.clients.find(cli => cli.id === state.client_id)
    const variables = {
      contract: {
        client_id:         client.id,
        contract_places:   state.places.map(place => ({ place_id: place.id })),
        from:              timeToUTC(state.from),
        to:                state.indefinitly ? null : timeToUTC(state.to),
        security_interval: state.securityInterval,
        generate_invoice:  state.generateInvoice
      }
    }

    if (state.newRent) {
      variables.contract = {
        ...variables.contract,
        rent: {
          currency_id: state.currency_id,
          price:       state.price / state.places.length
        }
      }
    } else {
      variables.contract = {
        ...variables.contract,
        rent_id: state.rent.id
      }
    }

    if (id) { // edit contract
      variables.contract = {
        ...variables.contract,
        remove_reservations: state.removeReservations
      }
    }

    const onSuccess = response => {
      nav.to(`/${getState().pageBase.garage}/admin/clients`)
      dispatch(eraseForm())
    }

    if (id) { // edit contract
      request(onSuccess, UPDATE_CONTRACT, { ...variables, id: +id })
    } else { // submit new contract
      const onSuccess = response => {
        nav.to(`/${getState().pageBase.garage}/admin/clients`)
        dispatch(eraseForm())
      }

      request(onSuccess, CREATE_CONTRACT, variables)
    }
  }
}

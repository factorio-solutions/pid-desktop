import moment from 'moment'

import { request } from '../helpers/request'

import { GET_CLIENTS, GARAGE_CONTRACTS } from '../queries/clients.queries'


export const SET_CLIENTS = 'SET_CLIENTS_CLIENTS_PAGE'
export const SET_GARAGE_CONTRACTS = 'SET_GARAGE_CONTRACTS'


export function setClients(clients) {
  return { type:  SET_CLIENTS,
    value: clients
  }
}

export function setGarageContracts(value) {
  return { type: SET_GARAGE_CONTRACTS,
    value
  }
}


function currentContracts(contract) {
  return moment().isBetween(moment(contract.from), moment(contract.to))
}

export function initClients() {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setClients(response.data.clients.map(client => ({
        ...client,
        userOfClient: true,
        place_count:  client.contracts
          .filter(currentContracts)
          .reduce((acc, contract) => acc + contract.contract_places.length, 0)
      }))))
    }
    request(onSuccess, GET_CLIENTS)
  }
}

export function initGarageContracts() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      const uniqueClients = response.data.garage.contracts.reduce((acc, contract) => {
        if (!acc.hasOwnProperty(contract.client.id)) {
          acc[contract.client.id] = {
            ...contract.client,
            userOfClient: false,
            is_admin:     false,
            contracts:    [],
            place_count:  0
          }
        }
        acc[contract.client.id].contracts.push(contract)
        if (currentContracts(contract)) {
          acc[contract.client.id].place_count += contract.contract_places.length
        }
        return acc
      }, [])

      dispatch(setGarageContracts(uniqueClients))
    }

    request(onSuccess, GARAGE_CONTRACTS, { id: getState().pageBase.garage })
  }
}

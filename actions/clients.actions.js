import { request } from '../helpers/request'

import { GET_CLIENTS, GARAGE_CONTRACTS } from '../queries/clients.queries'

export const SET_CLIENTS = 'SET_GARAGES'
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


export function initClients() {
  return dispatch => {
    const onSuccess = response => {
      const currentUserId = response.data.current_user.id
      const uniqueClients = response.data.client_users.reduce((acc, clientUser) => {
        if (acc.find(accumulated => accumulated.id === clientUser.client.id) === undefined) acc.push(clientUser.client)
        return acc
      }, [])

      const managebleClientIds = response.data.client_users
                                .filter(clientUser => clientUser.user_id === currentUserId && clientUser.admin)
                                .map(clientUsers => clientUsers.client.id)

      uniqueClients.map(client => ({
        ...client,
        admin:        managebleClientIds.includes(client.id),
        userOfClient: true
      }))

      dispatch(setClients(uniqueClients))
    }
    request(onSuccess, GET_CLIENTS)
  }
}

export function initGarageContracts() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      const uniqueClients = response.data.garage.contracts.reduce((acc, contract) => {
        if (!acc.hasOwnProperty(contract.client.id)) acc[contract.client.id] = { ...contract.client, userOfClient: false, admin: false, contracts: [] }
        acc[contract.client.id].contracts.push(contract)
        return acc
      }, [])

      dispatch(setGarageContracts(uniqueClients))
    }

    request(onSuccess, GARAGE_CONTRACTS, { id: getState().pageBase.garage })
  }
}

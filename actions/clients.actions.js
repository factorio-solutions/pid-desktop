import { request } from '../helpers/request'
import _           from 'lodash'

import { GET_CLIENTS, GARAGE_CONTRACTS } from '../queries/clients.queries'

export const SET_CLIENTS          = 'SET_GARAGES'
export const SET_GARAGE_CONTRACTS = 'SET_GARAGE_CONTRACTS'


export function setClients (clients){
  return  { type: SET_CLIENTS
          , value: clients
          }
}

export function setGarageContracts (value){
  return  { type: SET_GARAGE_CONTRACTS
          , value
          }
}


export function initClients (){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      var current_user_id = response.data.current_user.id
      var uniqueClients = _.uniqWith(response.data.client_users.map(function (client_users) {return client_users.client}),  _.isEqual)
      var managebleClientIds = response.data.client_users
                                .filter((client_user) => {return client_user.user_id == current_user_id && client_user.admin })
                                .map(function (client_users) {return client_users.client.id})

      uniqueClients.map((client) => {
        client.admin = managebleClientIds.includes(client.id)
        client.userOfClient = true
        return client
      })

      dispatch( setClients( uniqueClients ) )
    }
    request(onSuccess, GET_CLIENTS)
  }
}

export function initGarageContracts (){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      const uniqueClients = response.data.garage.contracts.reduce((acc, contract) => {
        if (!acc.hasOwnProperty(contract.client.id)) acc[contract.client.id] = {...contract.client, userOfClient: false, admin: false, contracts: [] }
        acc[contract.client.id].contracts.push({id: contract.id, name: contract.name})
        return acc
      }, [])

      dispatch(setGarageContracts(uniqueClients))
    }

    request(onSuccess, GARAGE_CONTRACTS, {id: getState().pageBase.garage})
  }
}

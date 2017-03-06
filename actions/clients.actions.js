import { request } from '../helpers/request'
import _           from 'lodash'

import { GET_CLIENTS } from '../queries/clients.queries'

export const SET_CLIENTS = "SET_GARAGES"


export function setClients (clients){
  return  { type: SET_CLIENTS
          , value: clients
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
        managebleClientIds.includes(client.id) ? client.admin = true : client.admin = false
        return client
      })

      dispatch( setClients( uniqueClients ) )
    }
    request(onSuccess, GET_CLIENTS)
  }
}

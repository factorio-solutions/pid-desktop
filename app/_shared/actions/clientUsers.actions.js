import { request }  from '../helpers/request'
import {t}          from '../modules/localization/localization'
import { setError } from './pageBase.actions'

import { GET_CLIENTUSERS, UPDATE_CLIENTUSERS, DESTROY_CLIENTUSERS } from '../queries/clientUsers.queries'
import { toClients } from './pageBase.actions'

export const SET_CLIENT_USERS          = 'SET_CLIENT_USERS'
export const SET_CLIENT_USER_CLIENT   = 'SET_CLIENT_USER_CLIENT'
export const SET_CLIENT_PENDING_USERS  = 'SET_CLIENT_PENDING_USERS'

export function setClientUsersUsers (users){
  return  { type: SET_CLIENT_USERS
          , value: users
          }
}

export function setClientUsersClient (client){
  return  { type: SET_CLIENT_USER_CLIENT
          , value: client
          }
}

export function setClientUsersPendingUsers (users){
  return  { type: SET_CLIENT_PENDING_USERS
          , value: users
          }
}


export function initClientUsers (client_id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setClientUsersUsers( response.data.client_users.filter((clientUser)=>{return clientUser.pending == false}) ) )
      response.data.client_users[0] && dispatch( setClientUsersClient(response.data.client_users[0].client) )
      dispatch( setClientUsersPendingUsers(response.data.client_users.filter((clientUser)=>{return clientUser.pending == true})) )

      dispatch(toClients())
    }
    request(onSuccess, GET_CLIENTUSERS, {id: parseInt(client_id)})
  }
}

export function destroyClientUser(client_id, user_id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.destroy_client_user == null){
        dispatch(setError( t(['inviteUser', 'noRights']) ))
      } else {
        dispatch( initClientUsers(response.data.destroy_client_user.client_id) )
      }
    }
    request(onSuccess, DESTROY_CLIENTUSERS, {
          "user_id": user_id,
          "client_id": parseInt(client_id)
        })
  }
}

export function setSecretary (client_id, user_id) {
  return (dispatch, getState) => {
    const relation = {
      // "admin": false,
      "secretary": true,
      "host": true,
      "internal": true
    }
    dispatch(setClientUserRelation(client_id, user_id, relation))
  }
}

export function setInternal(client_id, user_id) {
  return (dispatch, getState) => {
    const relation = {
      // "admin": false,
      "host": true,
      "secretary": false,
      "internal": true
    }
    dispatch(setClientUserRelation(client_id, user_id, relation))
  }
}

export function setClientUserRelation (client_id, user_id, relation){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.update_client_user == null){
        dispatch(setError( t(['inviteUser', 'noRights']) ))
      } else {
        dispatch( initClientUsers(response.data.update_client_user.client_id) )
      }
    }
    request(onSuccess, UPDATE_CLIENTUSERS, {
          "client_user": relation,
          "user_id": user_id,
          "client_id": parseInt(client_id)
        })
  }
}

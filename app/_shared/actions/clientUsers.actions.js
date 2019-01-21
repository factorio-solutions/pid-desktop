import { request } from '../helpers/request'
import { t } from '../modules/localization/localization'
import { setError, setSuccess } from './pageBase.actions'
import { clearForm } from './newReservation.actions'

import {
  GET_CLIENTUSERS,
  UPDATE_CLIENTUSERS,
  DESTROY_CLIENTUSERS,
  RESEND_INVITATION
} from '../queries/clientUsers.queries'


export const SET_CLIENT_USERS = 'SET_CLIENT_USERS'
export const SET_CLIENT_USER_CLIENT = 'SET_CLIENT_USER_CLIENT'
export const SET_CLIENT_PENDING_USERS = 'SET_CLIENT_PENDING_USERS'
export const SET_CLIENT_USERS_FILTER = 'SET_CLIENT_USERS_FILTER'
export const SET_CLIENT_USERS_NAME = 'SET_CLIENT_USERS_NAME'
export const SET_CLIENT_USERS_SELECTED_ID = 'SET_CLIENT_USERS_SELECTED_ID'


export function setClientUsersUsers(users) {
  return {
    type:  SET_CLIENT_USERS,
    value: users
  }
}

export function setClientUsersClient(client) {
  return {
    type:  SET_CLIENT_USER_CLIENT,
    value: client
  }
}

export function setClientUsersPendingUsers(users) {
  return {
    type:  SET_CLIENT_PENDING_USERS,
    value: users
  }
}

export function setFilters(value) {
  return {
    type: SET_CLIENT_USERS_FILTER,
    value
  }
}

export function allClicked() {
  return setFilters('all')
}

export function pendingClicked() {
  return setFilters('pending')
}

export function setClientName(value) {
  return {
    type: SET_CLIENT_USERS_NAME,
    value
  }
}

export function setSelectedId(value) {
  return {
    type: SET_CLIENT_USERS_SELECTED_ID,
    value
  }
}


export function initClientUsers(client_id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setClientUsersUsers(response.data.client_users.filter(clientUser => !clientUser.pending)))
      response.data.client_users[0] && dispatch(setClientUsersClient(response.data.client_users[0].client))
      dispatch(setClientUsersPendingUsers(response.data.client_users.filter(clientUser => clientUser.pending)))

      if (response.data.client_users[0]) {
        dispatch(setClientName(response.data.client_users[0].client.name))
      }
    }
    request(onSuccess, GET_CLIENTUSERS, { id: parseInt(client_id, 10) })
  }
}

export function destroyClientUser(client_id, user_id) {
  return dispatch => {
    const onSuccess = response => {
      if (response.data.destroy_client_user == null) {
        dispatch(setError(t([ 'inviteUser', 'noRights' ])))
      } else {
        dispatch(initClientUsers(response.data.destroy_client_user.client_id))
      }
    }
    request(onSuccess, DESTROY_CLIENTUSERS, {
      user_id,
      client_id: parseInt(client_id, 10)
    })
  }
}

export function resendInvitation(client_id, user_id) {
  return dispatch => {
    const onSuccess = response => {
      if (response.data.resend_invitation === null) {
        dispatch(setError(t([ 'clientUsers', 'userNotFound' ])))
      } else {
        dispatch(setSuccess(t([ 'clientUsers', 'resendSuccessfull' ])))
      }
    }
    request(onSuccess, RESEND_INVITATION, {
      user_id,
      client_id: parseInt(client_id, 10)
    })
  }
}

export function setSecretary(client_id, user_id) {
  return dispatch => {
    const relation = {
      // "admin": false,
      secretary: true,
      host:      true,
      internal:  true
    }
    dispatch(setClientUserRelation(client_id, user_id, relation))
  }
}

export function setInternal(client_id, user_id) {
  return dispatch => {
    const relation = {
      // "admin": false,
      host:      true,
      secretary: false,
      internal:  true
    }
    dispatch(setClientUserRelation(client_id, user_id, relation))
  }
}

export function setClientUserRelation(client_id, user_id, relation) {
  return dispatch => {
    const onSuccess = response => {
      if (response.data.update_client_user == null) {
        dispatch(setError(t([ 'inviteUser', 'noRights' ])))
      } else {
        dispatch(initClientUsers(response.data.update_client_user.client_id))
        dispatch(clearForm())
      }
    }
    request(onSuccess, UPDATE_CLIENTUSERS, {
      client_user: relation,
      user_id,
      client_id:   parseInt(client_id, 10)
    })
  }
}

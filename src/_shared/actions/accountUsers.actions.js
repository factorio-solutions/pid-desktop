import { request }  from '../helpers/request'
import {t}          from '../modules/localization/localization'
import { setError } from './pageBase.actions'

import { GET_ACCOUNTUSERS, UPDATE_ACCOUNTUSERS, DESTROY_ACCOUNTUSERS } from '../queries/accountUsers.queries'
import { toAccounts } from './pageBase.actions'

export const SET_ACCOUNT_USERS         = 'SET_ACCOUNT_USERS'
export const SET_ACCOUNTUSER_ACCOUNT   = 'SET_ACCOUNTUSER_ACCOUNT'
export const SET_ACCOUNT_PENDING_USERS = 'SET_ACCOUNT_PENDING_USERS'

export function setAccountUsersUsers (users){
  return  { type: SET_ACCOUNT_USERS
          , value: users
          }
}

export function setAccountUsersAccount (account){
  return  { type: SET_ACCOUNTUSER_ACCOUNT
          , value: account
          }
}

export function setAccountUsersPendingUsers (users){
  return  { type: SET_ACCOUNT_PENDING_USERS
          , value: users
          }
}


export function initAccountUsers (account_id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setAccountUsersUsers( response.data.account_users ) )
      dispatch( setAccountUsersAccount(response.data.account_users[0].account) )
      dispatch( setAccountUsersPendingUsers(response.data.pending_account_users) )

      dispatch(toAccounts())
    }
    request(onSuccess, GET_ACCOUNTUSERS, {id: parseInt(account_id)})
  }
}

export function destroyAccountUser(account_id, user_id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.destroy_account_user == null){
        dispatch(setError( t(['inviteUser', 'noRights']) ))
      } else {
        dispatch( initAccountUsers(response.data.destroy_account_user.account_id) )
      }
    }
    request(onSuccess, DESTROY_ACCOUNTUSERS, {
          "user_id": user_id,
          "account_id": parseInt(account_id)
        })
  }

}

export function setSecretary (account_id, user_id) {
  return (dispatch, getState) => {
    const relation = {
      // "can_manage": false,
      "can_create_own": true,
      "can_create_internal": true,
      "is_internal": true
    }
    dispatch(setAccountUserRelation(account_id, user_id, relation))
  }
}

export function setInternal(account_id, user_id) {
  return (dispatch, getState) => {
    const relation = {
      // "can_manage": false,
      "can_create_own": true,
      "can_create_internal": false,
      "is_internal": true
    }
    dispatch(setAccountUserRelation(account_id, user_id, relation))
  }
}

export function setAccountUserRelation (account_id, user_id, relation){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.update_account_user == null){
        dispatch(setError( t(['inviteUser', 'noRights']) ))
      } else {
        dispatch( initAccountUsers(response.data.update_account_user.account_id) )
      }
    }
    request(onSuccess, UPDATE_ACCOUNTUSERS, {
          "account_user": relation,
          "user_id": user_id,
          "account_id": parseInt(account_id)
        })
  }
}

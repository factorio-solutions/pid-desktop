import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'

export const EDIT_ACCOUNT_SET_NAME = "EDIT_ACCOUNT_SET_NAME"

import { EDIT_ACCOUNT_INIT, EDIT_ACCOUNT_MUTATION } from '../queries/editAccount.queries'


export function setName (name){
  return  { type: EDIT_ACCOUNT_SET_NAME
          , value: name
          }
}

export function initAccount(id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setName(response.data.account_users[0].account.name))
    }

    request( onSuccess
           , EDIT_ACCOUNT_INIT
           , { id: parseInt(id)}
           )
  }
}

export function submitEditAccount(id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      nav.to('/accounts')
    }

    request( onSuccess
           , EDIT_ACCOUNT_MUTATION
           , { id: parseInt(id), account: {name: getState().editAccount.name }}
           , "RenameAccount"
           )
  }
}

import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'

import { CREATE_NEW_ACCOUNT, EDIT_ACCOUNT_INIT, EDIT_ACCOUNT_MUTATION } from '../queries/newAccount.queries'

export const SET_ACCOUNT_NAME   = "SET_ACCOUNT_NAME"
export const CLEAR_ACCOUNT_FORM = "CLEAR_ACCOUNT_FORM"


export function setName (name){
  return  { type: SET_ACCOUNT_NAME
          , value: name
          }
}

export function clearForm (){
  return  { type: CLEAR_ACCOUNT_FORM }
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

export function submitNewAccount(id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(clearForm())
      nav.to('/accounts')
    }

    if (id) { // then edit account
      request( onSuccess
             , EDIT_ACCOUNT_MUTATION
             , { id: parseInt(id), account: {name: getState().newAccount.name }}
             , "RenameAccount"
             )
    } else { // then new account
      request( onSuccess
             , CREATE_NEW_ACCOUNT
             , { account: {name: getState().newAccount.name }}
             , "garageMutations"
             )
    }
  }
}

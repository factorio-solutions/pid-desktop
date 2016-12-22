import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'

import { CREATE_NEW_ACCOUNT } from '../queries/newAccount.queries'

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


export function submitNewAccount() {
  return (dispatch, getState) => {

    const onSuccess = (response) => {
      dispatch(clearForm())
      nav.to('/accounts')
    }

    request( onSuccess
           , CREATE_NEW_ACCOUNT
           , { account: {name: getState().newAccount.name }}
           , "garageMutations"
           )

  }
}

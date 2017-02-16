import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'

import { INIT_ACCOUNT, CREATE_ACCOUNT, UPDATE_ACCOUNT } from '../queries/newAccount.queries'


export const SET_NEW_ACCOUNT_NAME = "SET_NEW_ACCOUNT_NAME"
export const SET_NEW_ACCOUNT_MERCHANT_ID = "SET_NEW_ACCOUNT_MERCHANT_ID"
export const SET_NEW_ACCOUNT_LINE1 = "SET_NEW_ACCOUNT_LINE1"
export const SET_NEW_ACCOUNT_LINE2 = "SET_NEW_ACCOUNT_LINE2"
export const SET_NEW_ACCOUNT_CITY = "SET_NEW_ACCOUNT_CITY"
export const SET_NEW_ACCOUNT_POSTAL_CODE = "SET_NEW_ACCOUNT_POSTAL_CODE"
export const SET_NEW_ACCOUNT_STATE = "SET_NEW_ACCOUNT_STATE"
export const SET_NEW_ACCOUNT_COUNTRY = "SET_NEW_ACCOUNT_COUNTRY"
export const CLEAR_NEW_ACCOUNT_FORM = "CLEAR_NEW_ACCOUNT_FORM"


export function setName (value){
  return { type: SET_NEW_ACCOUNT_NAME
         , value
         }
}

export function setMerchantId (value){
  return { type: SET_NEW_ACCOUNT_MERCHANT_ID
         , value
         }
}

export function setLine1 (value){
  return { type: SET_NEW_ACCOUNT_LINE1
         , value
         }
}

export function setLine2 (value){
  return { type: SET_NEW_ACCOUNT_LINE2
         , value
         }
}

export function setCity (value){
  return { type: SET_NEW_ACCOUNT_CITY
         , value
         }
}

export function setPostalCode (value){
  return { type: SET_NEW_ACCOUNT_POSTAL_CODE
         , value
         }
}

export function setState (value){
  return { type: SET_NEW_ACCOUNT_STATE
         , value
         }
}

export function setCountry (value){
  return { type: SET_NEW_ACCOUNT_COUNTRY
         , value
         }
}

export function clearForm (value){
  return { type: CLEAR_NEW_ACCOUNT_FORM }
}

export function initAccount (id){
  return (dispatch, getState) => {
    const onSuccess = (response) =>{
      console.log(response);
      const account = response.data.accounts[0]

      dispatch(setName(account.name))
      dispatch(setMerchantId(account.merchant_id || ''))
      dispatch(setLine1(account.address.line_1))
      dispatch(setLine2(account.address.line_2 || ''))
      dispatch(setCity(account.address.city))
      dispatch(setPostalCode(account.address.postal_code))
      dispatch(setState(account.address.state || ''))
      dispatch(setCountry(account.address.country))
    }

    request(onSuccess, INIT_ACCOUNT, { id: +id } )
  }
}

export function submitNewAccount (id){
  return (dispatch, getState) => {
    const state = getState().newAccount
    const onSuccess = (response) =>{
      dispatch(clearForm())
      nav.to('/accounts')
    }

    if (id){
      request(onSuccess
             , UPDATE_ACCOUNT
             , { id: +id
               , account: generateAccount(state)
               }
             )
    } else {
      request(onSuccess
             , CREATE_ACCOUNT
             , { account: generateAccount(state) }
             )
    }
  }
}

function generateAccount (state){
  return { name: state.name
         , merchant_id: state.merchant_id === "" ? undefined : state.merchant_id
         , address: { line_1: state.line_1
                    , line_2: state.line_2 === "" ? undefined : state.line_2
                    , city: state.city
                    , postal_code: state.postal_code
                    , state: state.state === "" ? undefined : state.state
                    , country: state.country
                    }
         }
}

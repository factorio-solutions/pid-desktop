import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'
import {t}         from '../modules/localization/localization'

import { setCustomModal, setError }                                     from './pageBase.actions'
import { INIT_ACCOUNT, CREATE_ACCOUNT, UPDATE_ACCOUNT, GET_PERMISSION } from '../queries/newAccount.queries'


export const SET_NEW_ACCOUNT_NAME             = "SET_NEW_ACCOUNT_NAME"
export const SET_NEW_ACCOUNT_IC               = "SET_NEW_ACCOUNT_IC"
export const SET_NEW_ACCOUNT_DIC              = "SET_NEW_ACCOUNT_DIC"
export const SET_NEW_ACCOUNT_LINE1            = "SET_NEW_ACCOUNT_LINE1"
export const SET_NEW_ACCOUNT_LINE2            = "SET_NEW_ACCOUNT_LINE2"
export const SET_NEW_ACCOUNT_CITY             = "SET_NEW_ACCOUNT_CITY"
export const SET_NEW_ACCOUNT_POSTAL_CODE      = "SET_NEW_ACCOUNT_POSTAL_CODE"
export const SET_NEW_ACCOUNT_STATE            = "SET_NEW_ACCOUNT_STATE"
export const SET_NEW_ACCOUNT_COUNTRY          = "SET_NEW_ACCOUNT_COUNTRY"
export const CLEAR_NEW_ACCOUNT_FORM           = "CLEAR_NEW_ACCOUNT_FORM"
export const SET_NEW_ACCOUNT_PAYMENT_PROCESS  = "SET_NEW_ACCOUNT_PAYMENT_PROCESS"
export const SET_NEW_ACCOUNT_CSOB_MERCHANT_ID = "SET_NEW_ACCOUNT_CSOB_MERCHANT_ID"
export const SET_NEW_ACCOUNT_CSOB_PRIVATE_KEY = "SET_NEW_ACCOUNT_CSOB_PRIVATE_KEY"
export const SET_NEW_ACCOUNT_HIGHLIGHT        = "SET_NEW_ACCOUNT_HIGHLIGHT"


export function setName (value){
  return { type: SET_NEW_ACCOUNT_NAME
         , value
         }
}

export function setIC (value){
  return { type: SET_NEW_ACCOUNT_IC
         , value
         }
}
export function setDIC (value){
  return { type: SET_NEW_ACCOUNT_DIC
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

export function setPaymentProcess (value) {
  return { type: SET_NEW_ACCOUNT_PAYMENT_PROCESS
         , value
         }
}

export function setCsobMerchantId (value) {
  return { type: SET_NEW_ACCOUNT_CSOB_MERCHANT_ID
         , value
         }
}

export function setCsobPrivateKey (value) {
  return { type: SET_NEW_ACCOUNT_CSOB_PRIVATE_KEY
         , value
         }
}


export function setHighlight (value){
  return { type: SET_NEW_ACCOUNT_HIGHLIGHT
         , value
         }
}

export function toggleHighlight (){
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().newAccount.highlight))
  }
}

export function clearForm (value){
  return { type: CLEAR_NEW_ACCOUNT_FORM }
}

export function initAccount (id){
  return (dispatch, getState) => {
    const onSuccess = (response) =>{
      const account = response.data.accounts[0]

      dispatch(setName(account.name))
      dispatch(setPaymentProcess(account.paypal_email?'paypal':'csob'))
      dispatch(setCsobMerchantId(account.csob_merchant_id||''))
      dispatch(setCsobPrivateKey(account.csob_private_key?'stored':''))
      dispatch(setIC(account.ic || ''))
      dispatch(setDIC(account.dic || ''))
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
    switch (state.payments_process) {
      case 'paypal':
      const onPaypalSuccess = (response) =>{
        window.location.replace(response.data.paypal_get_permissions)
      }

      dispatch(setCustomModal(<div>{t(['newAccount', 'redirecting'])}</div>))
      var parameters = id ? { ...generateAccount(state), id: +id} : generateAccount(state)
      request( onPaypalSuccess
             , GET_PERMISSION
             , {url: `${window.location.href.split('?')[0]}?${encodeQueryData(parameters)}` }
             )
        break
      case 'csob':
      dispatch(setCustomModal(<div>{t(['newAccount', 'CSOBcreating'])}</div>))

      const onCsobSuccess = (response) =>{
        if (response.data.create_account == null && response.data.update_account == null){
          dispatch(setCustomModal(undefined))
          dispatch(setError(t(['newAccount', 'CSOBnotValid'])))
        } else {
          dispatch(clearForm())
          nav.to('/accounts')
          dispatch(setCustomModal(undefined))
        }
      }

      request(onCsobSuccess
             , id ? UPDATE_ACCOUNT : CREATE_ACCOUNT
             , { id: +id || null
               , account: { name:                    state.name
                          , csob_merchant_id:        state.csob_merchant_id
                          , csob_private_key:        state.csob_private_key == 'stored' ? null : state.csob_private_key // update account, key unchanged => set to null
                          , ic:                      state.ic || null
                          , dic:                     state.dic || null
                          , address:  { line_1:      state.line_1
                                      , line_2:      state.line_2 || null
                                      , city:        state.city
                                      , postal_code: state.postal_code
                                      , state:       state.state || null
                                      , country:     state.country
                                      }
                          }
               }
             )
        break
    }
  }
}

export function createAccount(params){
  return (dispatch, getState) => {
    dispatch(setCustomModal(<div>{params.id ? t(['newAccount', 'updatingAccount']) : t(['newAccount', 'creatingAccount'])}</div>))

    const onSuccess = (response) =>{
      dispatch(clearForm())
      nav.to('/accounts')
      dispatch(setCustomModal(undefined))
    }

    request(onSuccess
           , params.id ? UPDATE_ACCOUNT : CREATE_ACCOUNT
           , { id: +params.id || null
             , account: { name:                            params.name
                        , paypal_temporary_token:          params.request_token
                        , paypal_temporary_token_verifier: params.verification_code
                        , ic:                              params.ic || null
                        , dic:                             params.dic || null
                        , address:  { line_1:      params.line_1
                                    , line_2:      params.line_2 || null
                                    , city:        params.city
                                    , postal_code: params.postal_code
                                    , state:       params.state || null
                                    , country:     params.country
                                    }
                        }
             }
           )
  }
}

function encodeQueryData(data) {
   let ret = []
   for (let d in data) data[d] && ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
   return ret.join('&')
}

function generateAccount (state){
  return { name:        state.name
         , ic:          state.ic === "" ? undefined : state.ic
         , dic:         state.dic === "" ? undefined : state.dic
         , line_1:      state.line_1
         , line_2:      state.line_2 === "" ? undefined : state.line_2
         , city:        state.city
         , postal_code: state.postal_code
         , state:       state.state === "" ? undefined : state.state
         , country:     state.country
         }
}
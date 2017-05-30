import { request } from '../helpers/request'
import { t }       from '../modules/localization/localization'
import * as nav    from '../helpers/navigation'
import { setCustomModal } from './pageBase.actions'

import { GET_RENTS, GET_GARAGE_PAYMENT_METHOD, GET_PERMISSION, UPDATE_ACCOUNT } from '../queries/admin.finance.queries'

import { fetchCurrentUser } from './pageBase.actions'


export const ADMIN_FINANCE_SET_RENTS            = 'ADMIN_FINANCE_SET_RENTS'
export const ADMIN_FINANCE_SET_PAYPAL           = 'ADMIN_FINANCE_SET_PAYPAL'
export const ADMIN_FINANCE_SET_CSOB             = 'ADMIN_FINANCE_SET_CSOB'
export const ADMIN_FINANCE_SET_ACCOUNT_ID       = 'ADMIN_FINANCE_SET_ACCOUNT_ID'
export const ADMIN_FINANCE_SET_CSOB_MERCHANT_ID = 'ADMIN_FINANCE_SET_CSOB_MERCHANT_ID'
export const ADMIN_FINANCE_SET_CSOB_PRIVATE_KEY = 'ADMIN_FINANCE_SET_CSOB_PRIVATE_KEY'


export function setRents (rents){
  return  { type: ADMIN_FINANCE_SET_RENTS
          , value: rents
          }
}

export function setPaypal (value){
  return  { type: ADMIN_FINANCE_SET_PAYPAL
          , value
          }
}

export function setCSOB (value){
  return  { type: ADMIN_FINANCE_SET_CSOB
          , value
          }
}

export function setAccountId (value){
  return  { type: ADMIN_FINANCE_SET_ACCOUNT_ID
          , value
          }
}

export function setCsobMerchantId (value) {
  return { type: ADMIN_FINANCE_SET_CSOB_MERCHANT_ID
         , value
         }
}

export function setCsobPrivateKey (value) {
  return { type: ADMIN_FINANCE_SET_CSOB_PRIVATE_KEY
         , value
         }
}


export function initRents (){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setRents(response.data.rents) )
    }

    request(onSuccess, GET_RENTS)

    dispatch(fetchCurrentUser())
  }
}

export function initFinance (id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setCSOB(response.data.garage.account.csob_merchant_id !== null))
      dispatch(setCsobMerchantId(response.data.garage.account.csob_merchant_id||''))
      dispatch(setCsobPrivateKey(response.data.garage.account.csob_private_key?'stored':''))
      dispatch(setPaypal(response.data.garage.account.paypal_email!== null))
      dispatch(setAccountId(response.data.garage.account.id))
    }

    request(onSuccess, GET_GARAGE_PAYMENT_METHOD, {id: +id})
  }
}


export function paypalClick () {
  return (dispatch, getState) => {
    const onPaypalSuccess = (response) =>{
      window.location.replace(response.data.paypal_get_permissions)
    }

    dispatch(setCustomModal(<div>{t(['newAccount', 'redirecting'])}</div>))


    var parameters = {id: getState().adminFinance.account_id}
    request( onPaypalSuccess
      , GET_PERMISSION
      , {url: `${window.location.href.split('?')[0]}?${encodeQueryData(parameters)}` }
    )
  }
}

export function upadteAccount (params){
  return (dispatch, getState) => {
    const onSuccess = (response) =>{
      dispatch(setCustomModal(undefined))
      console.log(response);
    }

    request(onSuccess
           , UPDATE_ACCOUNT
           , { id: +params.id
             , account: { paypal_temporary_token:          params.request_token
                        , paypal_temporary_token_verifier: params.verification_code
                        }
             }
           )
  }
}

export function updateCsobAccount () {
  return (dispatch, getState) => {
    const state = getState().adminFinance
    const onSuccess = (response) =>{
      console.log(response);
      nav.to(`/${getState().pageBase.garage}/admin/finance`)
    }

    request(onSuccess
           , UPDATE_ACCOUNT
           , { id: +state.account_id
             , account: { csob_merchant_id: state.csob_merchant_id
                        , csob_private_key: state.csob_private_key == 'stored' ? null : state.csob_private_key // update account, key unchanged => set to null
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

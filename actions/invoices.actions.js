import { request }  from '../helpers/request'
import { download } from '../helpers/download'
import * as nav     from '../helpers/navigation'

import { GET_INVOICES, UPDATE_INVOICE, REMINDER_NOTIFICATION,GET_ACCOUNT_DETAILS, GET_CLIENT_DETAILS, DOWNLOAD_INVOICE } from '../queries/invoices.queries'
import { GET_BRAINTREE_TOKEN } from '../queries/newReservation.queries'
import { toAccounts, toClients } from './pageBase.actions'


export const INVOICES_SET_INVOICES        = "INVOICES_SET_INVOICES"
export const INVOICES_SET_CLIENT          = "INVOICES_SET_CLIENT"
export const INVOICES_SET_ACCOUNT         = "INVOICES_SET_ACCOUNT"
export const INVOICES_SET_PAST            = "INVOICES_SET_PAST"
export const INVOICES_SET_BRAINTREE_TOKEN = "INVOICES_SET_BRAINTREE_TOKEN"


export function setInvoices (value) {
  return { type: INVOICES_SET_INVOICES
         , value
         }
}

export function setClient (value) {
  return { type: INVOICES_SET_CLIENT
         , value
         }
}

export function setAccount (value) {
  return { type: INVOICES_SET_ACCOUNT
         , value
         }
}

export function setPast (value) {
  return { type: INVOICES_SET_PAST
         , value
         }
}

export function setBraintreeToken (value) {
  return { type: INVOICES_SET_BRAINTREE_TOKEN
         , value
         }
}

export function initAccounts (client_id, account_id) {
  return (dispatch, getState) => {
    const state = getState().invoices

    const onSuccess = (response) => {
      dispatch(setInvoices(response.data.invoices))
    }

    const onClient = (response) => {
      dispatch(setClient(response.data.client))
      dispatch(toClients())
    }

    const onAccount = (response) => {
      dispatch(setAccount(response.data.accounts[0]))
      dispatch(toAccounts())
    }

    request(onSuccess
           , GET_INVOICES
           , { client_id:   +client_id
             , account_id:  +account_id
             , past:        state.past
             }
           )

     client_id ? request( onClient, GET_CLIENT_DETAILS, { id: +client_id }) : request( onAccount, GET_ACCOUNT_DETAILS, { id: +account_id })
  }
}

export function payInit () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setBraintreeToken(response.data.current_user.braintree_token))
    }
    request( onSuccess, GET_BRAINTREE_TOKEN )
  }
}

export function payInvoice (id, payload) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      nav.back()
    }

    request(onSuccess
           , UPDATE_INVOICE
           , { id:      +id
             , invoice: { nonce: payload.nonce }
             }
           )
  }
}

export function invoicePayed (id) {
  return (dispatch, getState) => {
    const state = getState().invoices
    const onSuccess = (response) => {
      dispatch(initAccounts(state.client&&state.client.id, state.account&&state.account.id))
    }

    request(onSuccess
           , UPDATE_INVOICE
           , { id:      +id
             , invoice: { payed: true }
             }
           )
  }
}

export function downloadInvoice(id){
  return (dispatch, getState) => {
    const invoice = getState().invoices.invoices.find(invoice => invoice.id === id)
    download(`${invoice.id}.pdf`, DOWNLOAD_INVOICE, {id})
  }
}

export function reminder(id){
  return (dispatch, getState) => {
    const state = getState().invoices
    const onSuccess = (response) => {
      console.log(response);
    }

    const invoice = state.invoices.find((invoice) => {return invoice.id === id})
    invoice.client != null && invoice.client.admins.forEach((admin)=>{
      request(onSuccess
             , REMINDER_NOTIFICATION
             , { notification:{ user_id:admin.id
                              , notification_type: 'Yes'
                              , message: 'invoiceReminder;'+state.account.name
                              }
               }
             )
    })
  }
}

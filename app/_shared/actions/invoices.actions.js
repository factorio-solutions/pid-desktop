import { request } from '../helpers/request'

import { GET_INVOICES } from '../queries/invoices.queries'
import { toAccounts, toClients } from './pageBase.actions'


export const INVOICES_SET_INVOICES = "INVOICES_SET_INVOICES"
export const INVOICES_SET_CLIENT   = "INVOICES_SET_CLIENT"
export const INVOICES_SET_ACCOUNT  = "INVOICES_SET_ACCOUNT"
export const INVOICES_SET_PAST     = "INVOICES_SET_PAST"


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

export function initAccounts (client_id, account_id) {
  return (dispatch, getState) => {
    const state = getState().invoices

    const onSuccess = (response) => {
      console.log(response);
      dispatch(setInvoices(response.data.invoices))

      dispatch(client_id ? toClients() : toAccounts())
    }

    request(onSuccess
           , GET_INVOICES
           , { client_id:   +client_id
             , account_id:  +account_id
             , past:        state.past
             }
           )
  }
}

export function payInvoice (id) {
  return (dispatch, getState) => {}
}

export function invoicePayed (id) {
  return (dispatch, getState) => {}
}

export function downloadInvoice(id){
  return (dispatch, getState) => {}
}

export function reminder(id){
  return (dispatch, getState) => {}
}

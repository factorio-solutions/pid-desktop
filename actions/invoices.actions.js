import { request } from '../helpers/request'

import { GET_INVOICES } from '../queries/accounts.queries'


export const INVOICES_SET_INVOICES = "INVOICES_SET_INVOICES"


export function setInvoices (value) {
  return { type: INVOICES_SET_INVOICES
         , value
         }
}

export function initAccounts () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      console.log(response);
      // dispatch(setInvoices(response.data...))
    }

    request(onSuccess, GET_INVOICES)
  }
}

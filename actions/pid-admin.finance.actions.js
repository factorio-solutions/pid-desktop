import request from '../helpers/requestAdmin'
import actionFactory from '../helpers/actionFactory'

import { GET_UNPAID_INVOICES } from '../queries/pid-admin.finance.queries'


export const SET_PID_ADMIN_FINANCE_INVOICES = 'SET_PID_ADMIN_FINANCE_INVOICES'

export const setInvoices = actionFactory(SET_PID_ADMIN_FINANCE_INVOICES)


export function initFinance() {
  return dispatch => {
    request(GET_UNPAID_INVOICES)
    .then(data => dispatch(setInvoices(data.unpaid_invoices)))
  }
}

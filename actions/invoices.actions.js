import { request }  from '../helpers/request'
import { download, downloadMultiple } from '../helpers/download'
import { downloadCSV } from '../helpers/downloadCSV'
import { formatTime } from '../helpers/time'
import { t }        from '../modules/localization/localization'
import * as nav     from '../helpers/navigation'

import { GET_INVOICES, UPDATE_INVOICE, REMINDER_NOTIFICATION, GET_ACCOUNT_DETAILS, GET_CLIENT_DETAILS, DOWNLOAD_INVOICE, PAY_INVOICE } from '../queries/invoices.queries'
import { toAccounts, toClients, setError, setCustomModal } from './pageBase.actions'


export const INVOICES_SET_INVOICES = 'INVOICES_SET_INVOICES'
export const INVOICES_SET_CLIENTS = 'INVOICES_SET_CLIENTS'
export const INVOICES_SET_CLIENT_ID = 'INVOICES_SET_CLIENT_ID'
export const INVOICES_SET_PAST = 'INVOICES_SET_PAST'
export const INVOICES_SET_REASON = 'INVOICES_SET_REASON'
export const INVOICES_SET_INVOICE_ID = 'INVOICES_SET_INVOICE_ID'
export const INVOICES_TOGGLE_REASON_MODAL = 'INVOICES_TOGGLE_REASON_MODAL'
export const INVOICSE_SET_FILTERED_INVOICES = 'INVOICSE_SET_FILTERED_INVOICES'


export function setInvoices(value) {
  return { type: INVOICES_SET_INVOICES,
    value
  }
}

export function setClients(value) {
  return { type: INVOICES_SET_CLIENTS,
    value
  }
}

export function setClientId(value) {
  return { type: INVOICES_SET_CLIENT_ID,
    value
  }
}

export function setPast(value, garage_id) {
  return (dispatch, getState) => {
    dispatch({ type: INVOICES_SET_PAST,
      value
    })
    dispatch(initInvoices(garage_id))
  }
}

export function setReason(value) {
  return { type: INVOICES_SET_REASON,
    value
  }
}

export function toggleReason(id) {
  return { type:  INVOICES_TOGGLE_REASON_MODAL,
    value: id
  }
}

export function setFilteredInvoices(value) {
  return { type: INVOICSE_SET_FILTERED_INVOICES,
    value
  }
}


export function initInvoices(garage_id) {
  return (dispatch, getState) => {
    const state = getState().invoices

    const onSuccess = response => {
      dispatch(setInvoices(response.data.invoices))

      const garagesClients = response.data.invoices.reduce((acc, invoice) => {
        acc.garages[invoice.account.garage.id] = invoice.account.garage
        acc.clients[invoice.client.id] = invoice.client
        return acc
      }, { clients: {}, garages: {} })

      const clients = [ { name: t([ 'invoices', 'selectClient' ]), id: undefined } ]
      for (const key in garagesClients.clients) {
        if (garagesClients.clients.hasOwnProperty(key)) {
          clients.push(garagesClients.clients[key])
        }
      }
      dispatch(setClients(clients))
    }

    request(onSuccess
           , GET_INVOICES
           , {
             garage_id: garage_id && +garage_id,
             past:      state.past
           }
           )
  }
}

export function payInvoice(id) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setCustomModal(<div>{t([ 'invoices', 'redirecting' ])}</div>))
      window.location.replace(response.data.update_invoice.payment_url)
    }

    dispatch(setCustomModal(<div>{t([ 'invoices', 'initializingPayment' ])}</div>))
    request(onSuccess
           , UPDATE_INVOICE
           , { id:      +id,
             invoice: { url: window.location.href.split('?')[0] }
           }
           )
  }
}

export function paymentUnsucessfull() {
  return (dispatch, getState) => {
    dispatch(setError(t([ 'invoices', 'paymentUnsucessfull' ])))
  }
}

export function payInvoiceFinish(token) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setCustomModal(undefined))
    }

    dispatch(setCustomModal(<div>{t([ 'invoices', 'payingReservation' ])}</div>))
    request(onSuccess
           , PAY_INVOICE
           , { token }
           )
  }
}

export function invoicePayed(id, garage_id) {
  return (dispatch, getState) => {
    const state = getState().invoices
    const onSuccess = response => {
      dispatch(initInvoices(garage_id))
    }

    request(onSuccess
           , UPDATE_INVOICE
           , { id:      +id,
             invoice: { payed: true }
           }
           )
  }
}

export function stornoInvoice(id, garage_id) {
  return (dispatch, getState) => {
    const state = getState().invoices
    const onSuccess = response => {
      dispatch(initInvoices(garage_id))
    }

    dispatch(toggleReason())
    if (state.reason !== undefined && state.reason !== '') {
      request(onSuccess
        , UPDATE_INVOICE
        , { id:      +id,
          invoice: { canceled: true, reason: state.reason }
        }
      )
    }
  }
}

export function downloadInvoice(id) {
  return (dispatch, getState) => {
    const invoice = getState().invoices.invoices.find(invoice => invoice.id === id)
    download(`${invoice.id}.pdf`, DOWNLOAD_INVOICE, { id })
  }
}

export function reminder(id) {
  return (dispatch, getState) => {
    const state = getState().invoices
    const onSuccess = response => {}

    const invoice = state.invoices.find(invoice => { return invoice.id === id })
    invoice.client != null && invoice.client.admins.forEach(admin => {
      request(onSuccess
             , REMINDER_NOTIFICATION
             , { notification: { user_id:           admin.id,
               notification_type: 'Yes',
               message:           'invoiceReminder;' + invoice.account.garage.name
             }
             }
             )
    })
  }
}


export function generateExcel() {
  return (dispatch, getState) => {
    const invoices = getState().invoices.filteredInvoices

    const header = [ [ t([ 'invoices', 'invoiceNumber' ]),
      'id',
      t([ 'invoices', 'client' ]),
      t([ 'invoices', 'invoiceDate' ]),
      t([ 'invoices', 'dueDate' ]),
      t([ 'invoices', 'type' ]),
      t([ 'invoices', 'subject' ]),
      t([ 'invoices', 'ammount' ]),
      t([ 'invoices', 'paid' ]),
      t([ 'invoices', 'invoiceCanceled' ])
    ]
    ]

    const data = invoices.reduce((acc, invoice) => {
      return [ ...acc, [ invoice.invoice_number,
        invoice.id,
        invoice.client_name,
        formatTime(invoice.invoice_date),
        formatTime(invoice.due_date),
        invoice.longterm_rent ? t([ 'garages', 'longterm' ]) : t([ 'garages', 'shortterm' ]),
        invoice.subject,
        invoice.price,
        invoice.payed ? 'YES' : 'NO',
        invoice.canceled ? 'YES' : 'NO'
      ] ]
    }, header)

    downloadCSV(data)
  }
}


export function downloadZip() {
  return (dispatch, getState) => {
    const invoices = getState().invoices.filteredInvoices
    downloadMultiple('invoices.zip', DOWNLOAD_INVOICE, invoices.map(invoice => invoice.id))
  }
}

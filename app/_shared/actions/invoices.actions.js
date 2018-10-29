import React from 'react'

import { request }      from '../helpers/request'
import requestPromise   from '../helpers/requestPromise'
import { downloadCSV }  from '../helpers/downloadCSV'
import { downloadXLSX } from '../helpers/downloadXLSX'
import { formatTime }   from '../helpers/time'
import { t }            from '../modules/localization/localization'
import actionFactory    from '../helpers/actionFactory'

import {
  download,
  downloadMultiple
} from '../helpers/download'

import {
  GET_INVOICES,
  UPDATE_INVOICE,
  REMINDER_NOTIFICATION,
  DOWNLOAD_INVOICE,
  PAY_INVOICE,
  GET_USERS_INVOICES
} from '../queries/invoices.queries'

import {
  setError,
  setCustomModal
} from './pageBase.actions'


export const INVOICES_SET_INVOICES = 'INVOICES_SET_INVOICES'
export const INVOICES_SET_CLIENTS = 'INVOICES_SET_CLIENTS'
export const INVOICES_SET_CLIENT_ID = 'INVOICES_SET_CLIENT_ID'
export const INVOICES_SET_PAST = 'INVOICES_SET_PAST'
export const INVOICES_SET_REASON = 'INVOICES_SET_REASON'
export const INVOICES_SET_INVOICE_ID = 'INVOICES_SET_INVOICE_ID'
export const INVOICES_TOGGLE_REASON_MODAL = 'INVOICES_TOGGLE_REASON_MODAL'
export const INVOICES_SET_USERS_INVOICES = 'INVOICES_SET_USERS_INVOICES'


export const setInvoices = actionFactory(INVOICES_SET_INVOICES)
export const setClients = actionFactory(INVOICES_SET_CLIENTS)
export const setClientId = actionFactory(INVOICES_SET_CLIENT_ID)
export const setReason = actionFactory(INVOICES_SET_REASON)
export const toggleReason = actionFactory(INVOICES_TOGGLE_REASON_MODAL)
export const setUsersInvoices = actionFactory(INVOICES_SET_USERS_INVOICES)


export function setPast(value) {
  return dispatch => {
    dispatch({ type: INVOICES_SET_PAST,
      value
    })
  }
}


export function initInvoices(garageId) {
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

    request(onSuccess,
      GET_INVOICES,
      { garage_id: garageId && +garageId,
        past:      true
      }
    )
  }
}

export function initUserInvoices(garageId) {
  return dispatch => {
    requestPromise(GET_USERS_INVOICES, {
      garage_id: garageId && +garageId
    })
    .then(data => dispatch(setUsersInvoices(data.users_invoices)))
  }
}

export function payInvoice(id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setCustomModal(<div>{t([ 'invoices', 'redirecting' ])}</div>))
      window.location.replace(response.data.update_invoice.payment_url)
    }

    dispatch(setCustomModal(<div>{t([ 'invoices', 'initializingPayment' ])}</div>))
    request(onSuccess,
      UPDATE_INVOICE,
      { id:      +id,
        invoice: { url: window.location.href.split('?')[0] }
      }
    )
  }
}

export function paymentUnsucessfull() {
  return dispatch => {
    dispatch(setError(t([ 'invoices', 'paymentUnsucessfull' ])))
  }
}

export function payInvoiceFinish(token) {
  return dispatch => {
    const onSuccess = () => {
      dispatch(setCustomModal(undefined))
    }

    dispatch(setCustomModal(<div>{t([ 'invoices', 'payingReservation' ])}</div>))
    request(onSuccess, PAY_INVOICE, { token })
  }
}

export function invoicePayed(id, garageId) {
  return dispatch => {
    const onSuccess = () => {
      dispatch(initInvoices(garageId))
    }

    request(onSuccess,
      UPDATE_INVOICE,
      { id:      +id,
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
      request(onSuccess,
        UPDATE_INVOICE,
        { id:      +id,
          invoice: { canceled: true, reason: state.reason }
        }
      )
    }
  }
}

export function downloadInvoice(id, filename) {
  return () => {
    download(`${filename}.pdf`, DOWNLOAD_INVOICE, { id })
  }
}

export function reminder(id) {
  return (dispatch, getState) => {
    const state = getState().invoices
    const onSuccess = response => {}

    const invoice = state.invoices.find(invoice => { return invoice.id === id })
    invoice.client != null && invoice.client.admins.forEach(admin => {
      request(onSuccess,
        REMINDER_NOTIFICATION,
        { notification: {
          user_id:           admin.id,
          notification_type: 'Yes',
          message:           'invoiceReminder;' + invoice.account.garage.name
        } }
      )
    })
  }
}

function invoicesToArray(invoices) {
  const header = [ [
    t([ 'invoices', 'invoiceNumber' ]),
    'id',
    t([ 'invoices', 'client' ]),
    t([ 'invoices', 'invoiceDate' ]),
    t([ 'invoices', 'dueDate' ]),
    t([ 'invoices', 'type' ]),
    t([ 'invoices', 'subject' ]),
    t([ 'invoices', 'ammount' ]),
    t([ 'invoices', 'paid' ]),
    t([ 'invoices', 'invoiceCanceled' ])
  ] ]

  return invoices.reduce((acc, invoice) => [ ...acc,
    [ invoice.invoice_number,
      invoice.id,
      invoice.client.name,
      formatTime(invoice.invoice_date),
      formatTime(invoice.due_date),
      invoice.longterm_rent ? t([ 'garages', 'longterm' ]) : t([ 'garages', 'shortterm' ]),
      invoice.subject,
      invoice.price,
      invoice.payed ? 'YES' : 'NO',
      invoice.canceled ? 'YES' : 'NO'
    ]
  ], header)
}

export function generateCsv(invoices) {
  return () => {
    const data = invoicesToArray(invoices)
    downloadCSV(data)
  }
}

export function generateXlsx(invoices) {
  return () => {
    const data = invoicesToArray(invoices)
    downloadXLSX(data)
  }
}

export function downloadZip(invoices) {
  return () => {
    downloadMultiple(
      'invoices.zip',
      DOWNLOAD_INVOICE,
      invoices.map(invoice => invoice.id),
      invoices.map(invoice => invoice.invoice_number)
    )
  }
}

import moment from 'moment'

import request   from '../helpers/request'
import * as nav      from '../helpers/navigation'
import actionFactory from '../helpers/actionFactory'
import {
  MOMENT_DATETIME_FORMAT,
  timeToUTC
} from '../helpers/time'

import { DOWNLOAD_INVOICE, REGENERATE_INVOICE } from '../queries/editInvoice.queries'


export const EDIT_INVOICE_SET_AMOUNT = 'EDIT_INVOICE_SET_AMOUNT'
export const EDIT_INVOICE_SET_VAT = 'EDIT_INVOICE_SET_VAT'
export const EDIT_INVOICE_SET_HIGHLIGHT = 'EDIT_INVOICE_SET_HIGHLIGHT'
export const EDIT_INVOICE_SET_SUBJECT = 'EDIT_INVOICE_SET_SUBJECT'
export const EDIT_INVOICE_SET_INVOICE_DATE = 'EDIT_INVOICE_SET_INVOICE_DATE'
export const EDIT_INVOICE_SET_DUE_DATE = 'EDIT_INVOICE_SET_DUE_DATE'
export const EDIT_INVOICE_SET_INOVICE_NUMBER = 'EDIT_INVOICE_SET_INOVICE_NUMBER'
export const EDIT_INVOICE_SET_ORIGINAL = 'EDIT_INVOICE_SET_ORIGINAL'


export const setAmount = actionFactory(EDIT_INVOICE_SET_AMOUNT)
export const setVat = actionFactory(EDIT_INVOICE_SET_VAT)
export const setHighlight = actionFactory(EDIT_INVOICE_SET_HIGHLIGHT)
export const setSubject = actionFactory(EDIT_INVOICE_SET_SUBJECT)
export const setOriginal = actionFactory(EDIT_INVOICE_SET_ORIGINAL)


export function setInvoiceDate(value) {
  return {
    type:  EDIT_INVOICE_SET_INVOICE_DATE,
    value: moment(value, MOMENT_DATETIME_FORMAT).format(MOMENT_DATETIME_FORMAT)
  }
}

export function setDueDate(value) {
  return {
    type:  EDIT_INVOICE_SET_DUE_DATE,
    value: moment(value, MOMENT_DATETIME_FORMAT).format(MOMENT_DATETIME_FORMAT)
  }
}

export function toggleHighlight() {
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().editInvoice.highlight))
  }
}

export function initInvoice(id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setAmount(response.data.invoice.ammount))
      dispatch(setDueDate(moment(response.data.invoice.due_date).format(MOMENT_DATETIME_FORMAT)))
      dispatch(setInvoiceDate(moment(response.data.invoice.invoice_date).format(MOMENT_DATETIME_FORMAT)))
      dispatch(setVat(response.data.invoice.vat))
      dispatch(setSubject(response.data.invoice.subject))
      dispatch(setOriginal(response.data.invoice))
    }

    request(onSuccess, DOWNLOAD_INVOICE, { id: +id })
  }
}

export function submitInvoice() {
  return (dispatch, getState) => {
    const state = getState().editInvoice

    const onSuccess = () => {
      nav.to(`/${getState().pageBase.garage}/admin/invoices`)
    }

    request(
      onSuccess,
      REGENERATE_INVOICE,
      { id:      state.original.id,
        invoice: {
          ammount:      parseFloat(state.ammount),
          vat:          parseFloat(state.vat),
          subject:      state.subject,
          invoice_date: timeToUTC(state.invoice_date),
          due_date:     timeToUTC(state.due_date) }
      }
    )
  }
}

import actionFactory                  from '../helpers/actionFactory'
import request                    from '../helpers/request'
import requestPromise                 from '../helpers/requestPromise'
import { parseParameters }            from '../helpers/parseUrlParameters'
import { download, downloadMultiple } from '../helpers/download'

import { setCustomModal, setError } from './pageBase.actions'
import { t }                        from '../modules/localization/localization'

import {
  DESTROY_RESERVATION,
  CHECK_VALIDITY,
  CREATE_CSOB_PAYMENT,
  DESTROY_RECURRING_RESERVATIONS
} from '../queries/reservations.queries'
import { UPDATE_RESERVATION } from '../queries/newReservation.queries'
import { DOWNLOAD_INVOICE }   from '../queries/invoices.queries'

import { mobile } from '../../index'

export const RESERVATIONS_SET_PAST = 'RESERVATIONS_SET_PAST'
export const TOGGLE_RESERVATIONS_PAST = 'TOGGLE_RESERVATIONS_PAST'
export const RESERVATIONS_SET_NEW_NOTE = 'RESERVATIONS_SET_NEW_NOTE'
export const RESERVATIONS_SET_NEW_NOTE_RESERVATION = 'RESERVATIONS_SET_NEW_NOTE_RESERVATION'
export const RESERVATIONS_SET_STATE = 'RESERVATIONS_SET_STATE'

export const setPast = actionFactory(RESERVATIONS_SET_PAST)
export const togglePast = actionFactory(TOGGLE_RESERVATIONS_PAST)
export const setNewNote = actionFactory(RESERVATIONS_SET_NEW_NOTE)
export const setNewNoteReservation = actionFactory(RESERVATIONS_SET_NEW_NOTE_RESERVATION)
export const setState = actionFactory(RESERVATIONS_SET_STATE)


export function initReservations() { // will download first 5 reservations
  window.dispatchEvent(new Event('paginatedTableUpdate'))
  return () => {}
}

export function destroyReservation(id, callback) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setCustomModal())
      if (mobile) {
        callback()
      } else {
        dispatch(initReservations())
      }
    }
    dispatch(setCustomModal(t([ 'addFeatures', 'loading' ])))
    request(onSuccess, DESTROY_RESERVATION, { id })
  }
}

export function destroyRecurringReservations(id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(initReservations())
    }
    request(onSuccess, DESTROY_RECURRING_RESERVATIONS, { id })
  }
}

export function downloadInvoice(invoices) {
  return () => {
    if (invoices.length === 1) {
      download(`${invoices[0].invoice_number}.pdf`, DOWNLOAD_INVOICE, { id: invoices[0].id })
    } else {
      const ids = invoices.map(invoice => invoice.id)
      const fileNames = invoices.map(invoice => invoice.invoice_number)
      downloadMultiple('invoices.zip', DOWNLOAD_INVOICE, ids, fileNames)
    }
  }
}

export function payReservation(reservation) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setCustomModal(undefined))
      if (response.data.paypal_check_validity) {
        dispatch(setCustomModal(t([ 'newReservation', 'redirecting' ])))
        window.location.replace(reservation.payment_url)
      } else {
        dispatch(setError(t([ 'newReservation', 'tokenInvalid' ])))
        dispatch(initReservations())
      }
    }

    const onCSOBSuccess = response => {
      dispatch(setCustomModal(undefined))
      window.location.replace(response.data.csob_pay_reservation)
    }

    if (reservation.payment_url.includes('csob.cz')) {
      dispatch(setCustomModal(t([ 'newReservation', 'creatingNewPayment' ])))
      request(onCSOBSuccess, CREATE_CSOB_PAYMENT, { id: reservation.id, url: window.location.href.split('?')[0] })
    } else {
      dispatch(setCustomModal(t([ 'newReservation', 'validtyCheck' ])))
      request(onSuccess, CHECK_VALIDITY, { token: parseParameters(reservation.payment_url).token })
    }
  }
}

export function editReservationNote() {
  return async (dispatch, getState) => {
    const state = getState().reservations
    // HACK: place_id has to be sent, because of how update function works.
    await requestPromise(
      UPDATE_RESERVATION,
      {
        id:          state.newNoteReservation.id,
        reservation: {
          note:     state.newNote,
          place_id: state.newNoteReservation.place.id
        }
      }
    )
    dispatch(setNewNoteReservation())
    dispatch(initReservations())
  }
}

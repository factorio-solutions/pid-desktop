import actionFactory       from '../helpers/actionFactory'
import { request }         from '../helpers/request'
import requestPromise      from '../helpers/requestPromise'
import { download }        from '../helpers/download'
import { parseParameters } from '../helpers/parseUrlParameters'

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

export const setPast = actionFactory(RESERVATIONS_SET_PAST)
export const togglePast = actionFactory(TOGGLE_RESERVATIONS_PAST)
export const setNewNote = actionFactory(RESERVATIONS_SET_NEW_NOTE)
export const setNewNoteReservation = actionFactory(RESERVATIONS_SET_NEW_NOTE_RESERVATION)


export function initReservations() { // will download first 5 reservations
  window.dispatchEvent(new Event('paginatedTableUpdate'))
  return dispatch => {
    dispatch(setCustomModal(t([ 'addFeatures', 'loading' ])))
  }
}

export function destroyReservation(id, callback) {
  return dispatch => {
    const onSuccess = response => {
      if (mobile) {
        callback()
      } else {
        dispatch(initReservations())
      }
    }
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

export function downloadInvoice(id) {
  return () => {
    download(`${id}.pdf`, DOWNLOAD_INVOICE, { id })
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
  return (dispatch, getState) => {
    const state = getState().reservations
    requestPromise(
      UPDATE_RESERVATION,
      {
        id:          state.newNoteReservation.id,
        reservation: {
          note: state.newNote
        }
      }
    ).then(() => {
      dispatch(setNewNoteReservation())
      dispatch(initReservations())
    })
  }
}

import { request } from '../helpers/request'
import { download } from '../helpers/download'
import { setCustomModal, setError } from './pageBase.actions'
import { t } from '../modules/localization/localization'
import { parseParameters } from '../helpers/parseUrlParameters'

import { GET_RESERVATIONS_QUERY, DESTROY_RESERVATION, CHECK_VALIDITY, CREATE_CSOB_PAYMENT, DESTROY_RECURRING_RESERVATIONS } from '../queries/reservations.queries'
import { DOWNLOAD_INVOICE } from '../queries/invoices.queries'
import { PAY_RESREVATION } from '../queries/newReservation.queries'

import { mobile } from '../../index'


export const SET_RESERVATIONS = 'SET_RESERVATIONS'
export const TOGGLE_RESERVATIONS_PAST = 'TOGGLE_RESERVATIONS_PAST'


export function setReservations(reservations) { // for mobile reservations
  return {
    type:  SET_RESERVATIONS,
    value: reservations
  }
}

export function togglePast() {
  return { type: TOGGLE_RESERVATIONS_PAST }
}


export function initReservations(callback) { // callback used by mobile access page
  window.dispatchEvent(new Event('paginatedTableUpdate'))
  return (dispatch, getState) => {
    const onSuccess = respoonse => {
      dispatch(setReservations(respoonse.data.reservations))
      callback && callback(respoonse.data.reservations)
    }
    request(onSuccess, GET_RESERVATIONS_QUERY, { past: getState().reservations.past })
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
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(initReservations())
    }
    request(onSuccess, DESTROY_RECURRING_RESERVATIONS, { id })
  }
}

export function downloadInvoice(id) {
  return (dispatch, getState) => {
    download(`${id}.pdf`, DOWNLOAD_INVOICE, { id })
  }
}

export function payReservation(reservation) {
  return (dispatch, getState) => {
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

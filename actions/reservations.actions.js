import actionFactory from '../helpers/actionFactory'
import { request } from '../helpers/request'
import requestPromise from '../helpers/requestPromise'
import { download } from '../helpers/download'
import { setCustomModal, setError } from './pageBase.actions'
import { t } from '../modules/localization/localization'
import { parseParameters } from '../helpers/parseUrlParameters'

import { GET_RESERVATIONS_QUERY, GET_RESERVATIONS_PAGINATION_QUERY, DESTROY_RESERVATION, CHECK_VALIDITY, CREATE_CSOB_PAYMENT, DESTROY_RECURRING_RESERVATIONS } from '../queries/reservations.queries'
import { DOWNLOAD_INVOICE } from '../queries/invoices.queries'
import { PAY_RESREVATION, UPDATE_RESERVATION } from '../queries/newReservation.queries'

import { mobile } from '../../index'


export const RESERVATIONS_PER_PAGE = 5

export const SET_ONGOING_RESERVATIONS = 'SET_ONGOING_RESERVATIONS'
export const SET_RESERVATIONS = 'SET_RESERVATIONS'
export const ADD_RESERVATIONS = 'ADD_RESERVATIONS'
export const RESERVATIONS_SET_PAGE = 'RESERVATIONS_SET_PAGE'
export const RESERVATIONS_SET_PAST = 'RESERVATIONS_SET_PAST'
export const TOGGLE_RESERVATIONS_PAST = 'TOGGLE_RESERVATIONS_PAST'
export const RESERVATIONS_SET_NEW_NOTE = 'RESERVATIONS_SET_NEW_NOTE'
export const RESERVATIONS_SET_NEW_NOTE_RESERVATION = 'RESERVATIONS_SET_NEW_NOTE_RESERVATION'

export const setOngoingReservations = actionFactory(SET_ONGOING_RESERVATIONS)
export const setReservations = actionFactory(SET_RESERVATIONS)
export const addReservations = actionFactory(ADD_RESERVATIONS)
export const setPage = actionFactory(RESERVATIONS_SET_PAGE)
export const setPast = actionFactory(RESERVATIONS_SET_PAST)
export const togglePast = actionFactory(TOGGLE_RESERVATIONS_PAST)
export const setNewNote = actionFactory(RESERVATIONS_SET_NEW_NOTE)
export const setNewNoteReservation = actionFactory(RESERVATIONS_SET_NEW_NOTE_RESERVATION)


export function initOngoingReservations(callback) { // callback used by mobile access page
  return (dispatch, getState) => {
    dispatch(setCustomModal(t([ 'addFeatures', 'loading' ])))

    const onSuccess = response => {
      dispatch(setOngoingReservations(response.data.reservations))
      dispatch(setCustomModal())
      callback(response.data.reservations)
    }
    request(onSuccess, GET_RESERVATIONS_QUERY, {
      past:      false,
      ongoing:   true,
      user_id:   getState().mobileHeader.current_user.id,
      order_by:  'begins_at',
      garage_id: getState().mobileHeader.garage_id
    })
  }
}

export function initReservations() { // will download first 5 reservations
  window.dispatchEvent(new Event('paginatedTableUpdate'))
  return (dispatch, getState) => {
    dispatch(setCustomModal(t([ 'addFeatures', 'loading' ])))
    if (mobile) {
      const state = getState().reservations
      const onSuccess = response => {
        dispatch(setReservations(response.data.reservations))
        dispatch(setCustomModal())
      }
      request(onSuccess, GET_RESERVATIONS_PAGINATION_QUERY, {
        past:      state.past,
        user_id:   getState().mobileHeader.current_user.id,
        count:     RESERVATIONS_PER_PAGE,
        page:      1,
        order_by:  'begins_at',
        garage_id: getState().mobileHeader.garage_id
      })
    }
  }
}

export function loadReservations() { // will load 5 more reservations
  window.dispatchEvent(new Event('paginatedTableUpdate'))
  return (dispatch, getState) => {
    if (mobile) {
      const state = getState().reservations
      const onSuccess = response => {
        dispatch(addReservations(response.data.reservations))
      }
      request(onSuccess, GET_RESERVATIONS_PAGINATION_QUERY, {
        past:      state.past,
        user_id:   getState().mobileHeader.current_user.id,
        count:     RESERVATIONS_PER_PAGE,
        page:      state.page + 1,
        order_by:  'begins_at',
        garage_id: getState().mobileHeader.garage_id
      })
    }
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

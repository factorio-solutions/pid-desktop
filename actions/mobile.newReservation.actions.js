import moment from 'moment'
import { request } from '../helpers/request'
import { parseParameters } from '../helpers/parseUrlParameters'
import { setError, setCustomModal } from './mobile.header.actions'
import { MOMENT_DATETIME_FORMAT_MOBILE, MOMENT_UTC_DATETIME_FORMAT, timeToUTCmobile, toFifteenMinuteStep } from '../helpers/time'

import { GET_AVAILABLE_FLOORS } from '../queries/mobile.newReservation.queries'
import { CREATE_RESERVATION, GET_AVAILABLE_CLIENTS, GET_USER, PAY_RESREVATION } from '../queries/newReservation.queries'
import { CHECK_VALIDITY, CREATE_CSOB_PAYMENT } from '../queries/reservations.queries'
import { AVAILABLE_DURATIONS } from '../../reservations/newReservation.page'
import { entryPoint } from '../../index'
import { t } from '../modules/localization/localization'

export const MOBILE_NEW_RESERVATION_SET_FROM = 'MOBILE_NEW_RESERVATION_SET_FROM'
export const MOBILE_NEW_RESERVATION_SET_TO = 'MOBILE_NEW_RESERVATION_SET_TO'
export const MOBILE_NEW_RESERVATION_SET_FROM_NOW = 'MOBILE_NEW_RESERVATION_SET_FROM_NOW'
export const MOBILE_NEW_RESERVATION_SET_DURATION = 'MOBILE_NEW_RESERVATION_SET_DURATION'
export const MOBILE_NEW_RESERVATION_SET_CLIENT_ID = 'MOBILE_NEW_RESERVATION_SET_CLIENT_ID'
export const MOBILE_NEW_RESERVATION_SET_AVAILABLE_CLIENTS = 'MOBILE_NEW_RESERVATION_SET_AVAILABLE_CLIENTS'
export const MOBILE_NEW_RESERVATION_AVAILABLE_CARS = 'MOBILE_NEW_RESERVATION_AVAILABLE_CARS'
export const MOBILE_NEW_RESERVATION_CAR_ID = 'MOBILE_NEW_RESERVATION_CAR_ID'
export const MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE = 'MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE'
export const MOBILE_NEW_RESERVATION_SET_PLACE_ID = 'MOBILE_NEW_RESERVATION_SET_PLACE_ID'
export const MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS = 'MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS'
export const MOBILE_NEW_RESERVATION_SET_AUTOSELECT = 'MOBILE_NEW_RESERVATION_SET_AUTOSELECT'
export const MOBILE_NEW_RESERVATION_CLEAR_FORM = 'MOBILE_NEW_RESERVATION_CLEAR_FORM'


export function setFrom(from) { // if time changed,
  return (dispatch, getState) => {
    if (getState().mobileNewReservation.from !== from) {
      dispatch({
        type:  MOBILE_NEW_RESERVATION_SET_FROM,
        value: roundTime(from)
      })

      const state = getState().mobileNewReservation
      if (!fromBeforeTo(from, state.to)) {
        dispatch(setDuration(AVAILABLE_DURATIONS[0]))
      }
      if (fromBeforeTo(from, moment())) {
        dispatch(setFromNow(true))
      }

      dispatch(pickPlaces())
    }
  }
}

export function setTo(to) {
  return (dispatch, getState) => {
    const state = getState().mobileNewReservation

    if (!fromBeforeTo(state.from || moment(), to)) {
      dispatch(setDuration(AVAILABLE_DURATIONS[0]))
    } else {
      if (getState().mobileNewReservation.to !== to) {
        dispatch({
          type:  MOBILE_NEW_RESERVATION_SET_TO,
          value: roundTime(to)
        })
        dispatch(pickPlaces())
      }
    }
  }
}

export function setFromNow(bool) {
  return {
    type:  MOBILE_NEW_RESERVATION_SET_FROM_NOW,
    value: bool
  }
}

export function setDuration(duration) {
  return (dispatch, getState) => {
    if (getState().mobileNewReservation.duration !== duration) {
      dispatch({
        type:  MOBILE_NEW_RESERVATION_SET_DURATION,
        value: duration
      })
      if (duration !== undefined) { // if set to undefined, then setTo is going to take care of pickPlaces
        dispatch(pickPlaces())
      }
    }
  }
}

export function setClientId(value) {
  return dispatch => {
    dispatch({
      type: MOBILE_NEW_RESERVATION_SET_CLIENT_ID,
      value
    })

    dispatch(pickPlaces(true)) // no download clients
  }
}

export function setAvailableClients(value) {
  value.unshift({ name: t([ 'mobileApp', 'newReservation', 'me' ]), id: undefined })
  return {
    type: MOBILE_NEW_RESERVATION_SET_AVAILABLE_CLIENTS,
    value
  }
}

export function setAvailableCars(value) {
  return {
    type: MOBILE_NEW_RESERVATION_AVAILABLE_CARS,
    value
  }
}

export function setCarId(value) {
  return {
    type: MOBILE_NEW_RESERVATION_CAR_ID,
    value
  }
}

export function setCarLicencePlate(value) {
  return {
    type: MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE,
    value
  }
}


export function setFloors(floors) {
  return {
    type:  MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS,
    value: floors
  }
}

export function setPlace(id) {
  return dispatch => {
    dispatch({
      type:  MOBILE_NEW_RESERVATION_SET_PLACE_ID,
      value: id
    })
    dispatch(setAutoselect(false))
  }
}

export function setAutoselect(bool) {
  return {
    type:  MOBILE_NEW_RESERVATION_SET_AUTOSELECT,
    value: bool
  }
}

function clearForm() {
  return { type: MOBILE_NEW_RESERVATION_CLEAR_FORM }
}


export function initReservation() {
  return dispatch => {
    dispatch(pickPlaces())
    dispatch(getAvailableCars())
  }
}

export function roundTime(time) {
  return moment(time).set('minute', toFifteenMinuteStep(moment(time).minutes())).format(MOMENT_DATETIME_FORMAT_MOBILE) // .format(MOMENT_DATETIME_FORMAT)
}

export function fromBeforeTo(from, to) {
  // return (moment(to).diff(moment(from)) > 0)
  return moment(from).isBefore(moment(to))
}

export function getAvailableClients() {
  return (dispatch, getState) => {
    const state = getState().mobileNewReservation
    const garageId = getState().mobileHeader.garage_id
    const onClients = response => {
      if (response.data.last_reservation_client) { // I see client from last reservation
        const client = response.data.reservable_clients.findById(response.data.last_reservation_client.id)
        client && state.client_id !== client.id && dispatch(setClientId(client.id))
      } else {
        response.data.reservable_clients.findById(state.client_id) === undefined && state.client_id !== undefined && dispatch(setClientId(undefined))
      }
      // if (response.data.reservable_clients.find(cl => cl.id === state.client_id) === undefined) {
      //   state.client_id !== undefined && dispatch(setClientId(undefined))
      //   // response.data.reservable_clients[0] ? response.data.reservable_clients[0].id : undefined
      // }
      dispatch(setAvailableClients(response.data.reservable_clients))
    }

    request(onClients, GET_AVAILABLE_CLIENTS, { garage_id: garageId })
  }
}

export function getAvailableCars() {
  return (dispatch, getState) => {
    const id = getState().mobileHeader.current_user.id

    const onCars = response => {
      dispatch(setAvailableCars(response.data.user.reservable_cars))
      getState().mobileNewReservation.car_id === undefined && (response.data.user.reservable_cars.length === 1 ?
        dispatch(setCarId(response.data.user.reservable_cars[0].id)) :
        dispatch(setCarId(undefined)))
    }

    request(onCars, GET_USER, { id })
  }
}

export function pickPlaces(noClientDownload) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setFloors(response.data.garage.floors))

      if (response.data.garage.floors.find(floor => floor.free_places.find(place => place.id === getState().mobileNewReservation.place_id)) === undefined) {
        // autoselect place if selected place is not available anymore
        dispatch(autoselectPlace())
      }
    }

    const variables = stateToVariables(getState)
    if (variables.garage_id) {
      request(onSuccess, GET_AVAILABLE_FLOORS, { id: variables.garage_id, begins_at: variables.begins_at, ends_at: variables.ends_at, client_id: variables.client_id })
      !noClientDownload && dispatch(getAvailableClients())
    } else {
      dispatch(setFloors([]))
      dispatch(autoselectPlace())
    }
  }
}

export function checkGarageChange(garageId, nextGarageId) {
  return dispatch => {
    if (garageId !== nextGarageId) {
      dispatch(pickPlaces())
    }
  }
}

export function autoselectPlace() {
  return (dispatch, getState) => {
    const freePlaces = getState().mobileNewReservation.availableFloors.reduce((arr, floor) => { // free places,
      return arr.concat(floor.free_places.filter(place => { return getState().mobileNewReservation.client_id === undefined ? place.pricing !== undefined : true }))
    }, [])

    dispatch(setPlace(freePlaces.length === 0 ? undefined : freePlaces[0].id))
    dispatch(setAutoselect(true))
  }
}

export function submitReservation(callback) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      if (response.data.create_reservation.payment_url) {
        dispatch(payReservation(response.data.create_reservation.payment_url, callback))
      } else {
        dispatch(setCustomModal())
        dispatch(clearForm())
        callback()
      }
    }

    let reservation = stateToVariables(getState)
    delete reservation.garage_id

    dispatch(setCustomModal(reservation.client_id ? t([ 'mobileApp', 'newReservation', 'creatingReservation' ]) : t([ 'mobileApp', 'newReservation', 'creatingPayment' ])))

    request(onSuccess, CREATE_RESERVATION, {
      reservation: {
        user_id:       getState().mobileHeader.current_user.id,
        place_id:      reservation.place_id,
        client_id:     reservation.client_id,
        car_id:        reservation.car_id,
        licence_plate: reservation.licence_plate === '' ? undefined : reservation.licence_plate,
        url:           window.cordova === undefined ? window.location.href.split('?')[0] // development purposes - browser debuging
                                                    : entryPoint.includes('alpha') ? 'https://pid-alpha.herokuapp.com/#/en/reservations/newReservation/overview/'
                                                                                   : 'https://pid-beta.herokuapp.com/#/en/reservations/newReservation/overview/',
        begins_at: reservation.begins_at,
        ends_at:   reservation.ends_at
      }
    }, 'reservationMutation')
  }
}

export function checkReservation(reservation, callback = () => {}) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setCustomModal(undefined))
      if (response.data.paypal_check_validity) {
        dispatch(payReservation(reservation.payment_url, callback))
      } else {
        dispatch(setError(t([ 'mobileApp', 'newReservation', 'tokenNoLongerValid' ])))
        callback()
      }
    }

    const onCSOBSuccess = response => {
      dispatch(setCustomModal(undefined))
      dispatch(payReservation(response.data.csob_pay_reservation, callback))
    }

    if (reservation.payment_url.includes('csob.cz')) {
      dispatch(setCustomModal(t([ 'mobileApp', 'newReservation', 'creatingPayment' ])))
      request(onCSOBSuccess, CREATE_CSOB_PAYMENT, { id: reservation.id, url: window.location.href.split('?')[0] })
    } else {
      dispatch(setCustomModal(t([ 'mobileApp', 'newReservation', 'checkingToken' ])))
      request(onSuccess, CHECK_VALIDITY, { token: parseParameters(url).token })
    }
  }
}

export function payReservation(url, callback = () => {}) {
  return dispatch => {
    dispatch(setCustomModal(t([ 'mobileApp', 'newReservation', 'redirecting' ])))
    if (window.cordova === undefined) { // development purposes - browser debuging
      window.location.replace(url)
    } else { // in mobile open InAppBrowser, when redirected back continue
      const inAppBrowser = cordova.InAppBrowser.open(url, '_blank', 'location=no,zoom=no,toolbar=no')
      inAppBrowser.addEventListener('loadstart', event => {
        if (!event.url.includes('paypal') && !event.url.includes('csob.cz') && !event.url.includes('park-it-direct')) { // no paypal in name means redirected back
          inAppBrowser.close()
          const parameters = parseParameters(event.url)
          if (parameters.csob === 'true') {
            parameters.success === 'true' ? dispatch(paymentSucessfull(callback)) : dispatch(paymentUnsucessfull(callback)) // todo: here
          } else {
            parameters.success === 'true' ? dispatch(finishReservation(parameters.token, callback)) : dispatch(paymentUnsucessfull(callback))
          }
        }
      })
    }
  }
}

export function paymentUnsucessfull(callback) {
  return dispatch => {
    dispatch(setCustomModal(undefined))
    dispatch(setError(t([ 'mobileApp', 'newReservation', 'paymentUnsucessfull' ])))
    dispatch(clearForm())
    callback()
  }
}

export function paymentSucessfull(callback) {
  return dispatch => {
    dispatch(setCustomModal(undefined))
    dispatch(clearForm())
    callback()
  }
}

export function finishReservation(token, callback) {
  return dispatch => {
    const onSuccess = () => {
      dispatch(paymentSucessfull(callback))
    }

    dispatch(setCustomModal(t([ 'mobileApp', 'newReservation', 'processingPayment' ])))
    request(
      onSuccess,
      PAY_RESREVATION,
      { token }
    )
  }
}


function stateToVariables(getState) {
  const state = getState().mobileNewReservation
  const from = state.fromNow ? timeToUTCmobile(roundTime(moment())) : timeToUTCmobile(state.from)
  const to = state.duration ? timeToUTCmobile(roundTime(moment(from, MOMENT_UTC_DATETIME_FORMAT).add(state.duration, 'hours'))) : timeToUTCmobile(state.to)
  const garageId = getState().mobileHeader.garage_id

  return ({
    place_id:      state.place_id,
    client_id:     state.client_id,
    car_id:        state.car_id,
    licence_plate: state.carLicencePlate,
    garage_id:     garageId,
    begins_at:     from,
    ends_at:       to
  })
}

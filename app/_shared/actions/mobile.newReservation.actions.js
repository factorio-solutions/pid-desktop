import React from 'react'
import moment from 'moment'

import { batchActions } from 'redux-batched-actions'
import request from '../helpers/request'
import actionFactory from '../helpers/actionFactory'
import requestPromise from '../helpers/requestPromise'
import { parseParameters } from '../helpers/parseUrlParameters'
import {
  MOMENT_DATETIME_FORMAT_MOBILE,
  MOMENT_UTC_DATETIME_FORMAT,
  timeToUTCmobile,
  toFifteenMinuteStep
} from '../helpers/time'
import { t } from '../modules/localization/localization'
import {
  setError, setCustomModal, setGarage as setMobileHeaderGarage
} from './mobile.header.actions'

import { isPlaceGoInternal } from './newReservation.actions'

import RoundButton from '../components/buttons/RoundButton'

import { GET_GARAGE, GET_AVAILABLE_USERS } from '../queries/mobile.newReservation.queries'
import {
  CREATE_RESERVATION_NEW,
  UPDATE_RESERVATION_NEW,
  GET_AVAILABLE_CLIENTS,
  GET_USER,
  PAY_RESREVATION,
  GET_RESERVATION
} from '../queries/newReservation.queries'
import { USER_AVAILABLE, ADD_CLIENT_USER } from '../queries/inviteUser.queries'
import { CHECK_VALIDITY, CREATE_CSOB_PAYMENT } from '../queries/reservations.queries'
import { AVAILABLE_DURATIONS } from '../../reservations/newReservation.page'
import { entryPoint } from '../../index'

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
export const MOBILE_NEW_RESERVATION_SET_RESERVATION_ID = 'MOBILE_NEW_RESERVATION_SET_RESERVATION_ID'
export const MOBILE_NEW_RESERVATION_SET_ALL = 'MOBILE_NEW_RESERVATION_SET_ALL'
export const MOBILE_NEW_RESERVATION_SET_GUEST_RESERVATION = 'MOBILE_NEW_RESERVATION_SET_GUEST_RESERVATION'
export const MOBILE_NEW_RESERVATION_SET_AVAILABLE_USERS = 'MOBILE_NEW_RESERVATION_SET_AVAILABLE_USERS'
export const MOBILE_NEW_RESERVATION_SET_USER_ID = 'MOBILE_NEW_RESERVATION_SET_USER_ID'
export const MOBILE_NEW_RESERVATION_SET_GARAGE = 'MOBILE_NEW_RESERVATION_SET_GARAGE'
export const MOBILE_NEW_RESERVATION_SET_MIN_DURATION = 'MOBILE_NEW_RESERVATION_SET_MIN_DURATION'
export const MOBILE_NEW_RESERVATION_SET_MAX_DURATION = 'MOBILE_NEW_RESERVATION_SET_MAX_DURATION'


export const setAvailableCars = actionFactory(MOBILE_NEW_RESERVATION_AVAILABLE_CARS)
export const setCarId = actionFactory(MOBILE_NEW_RESERVATION_CAR_ID)
export const setCarLicencePlate = actionFactory(MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE)
export const setAutoselect = actionFactory(MOBILE_NEW_RESERVATION_SET_AUTOSELECT)
export const clearForm = actionFactory(MOBILE_NEW_RESERVATION_CLEAR_FORM)
export const setReservationId = actionFactory(MOBILE_NEW_RESERVATION_SET_RESERVATION_ID)
export const setGuestReservation = actionFactory(MOBILE_NEW_RESERVATION_SET_GUEST_RESERVATION)
export const setAvailableUsers = actionFactory(MOBILE_NEW_RESERVATION_SET_AVAILABLE_USERS)
export const setGarage = actionFactory(MOBILE_NEW_RESERVATION_SET_GARAGE)
export const setMinDuration = actionFactory(MOBILE_NEW_RESERVATION_SET_MIN_DURATION)
export const setMaxDuration = actionFactory(MOBILE_NEW_RESERVATION_SET_MAX_DURATION)


export function setUserId(value) {
  return dispatch => {
    dispatch({ type: MOBILE_NEW_RESERVATION_SET_USER_ID, value })
    value && dispatch(getAvailableCars())
    value && dispatch(getAvailableClients())
  }
}

export function setFrom(from) { // if time changed,
  return (dispatch, getState) => {
    if (getState().newReservation.from !== from) {
      dispatch({
        type:  MOBILE_NEW_RESERVATION_SET_FROM,
        value: roundTime(from)
      })

      const state = getState().newReservation
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

export function selectedClient() {
  return (dispatch, getState) => {
    const state = getState().newReservation
    return state.user_id
    && state.client_id
    && state.availableClients
    && state.availableClients.findById(state.client_id)
  }
}

export function setTo(to) {
  return (dispatch, getState) => {
    const state = getState().newReservation

    if (!fromBeforeTo(state.from || moment(), to)) {
      dispatch(setDuration(AVAILABLE_DURATIONS[0]))
    } else if (getState().newReservation.to !== to) {
      dispatch({
        type:  MOBILE_NEW_RESERVATION_SET_TO,
        value: roundTime(to)
      })
      dispatch(pickPlaces())
    }
  }
}

export function setFromNow(bool) {
  return {
    type:  MOBILE_NEW_RESERVATION_SET_FROM_NOW,
    value: bool
  }
}

export function setClientId(value) {
  return dispatch => {
    dispatch({
      type: MOBILE_NEW_RESERVATION_SET_CLIENT_ID,
      value
    })
    // no download clients
    dispatch(pickPlaces(true))
    dispatch(formatTo())
    dispatch(setMinMaxDuration())
  }
}

export function setAvailableClients(value) {
  return (dispatch, getState) => {
    if (!getState().newReservation.guestReservation) {
      value.unshift({ name: t([ 'mobileApp', 'newReservation', 'me' ]), id: 0 })
    }
    dispatch({
      type: MOBILE_NEW_RESERVATION_SET_AVAILABLE_CLIENTS,
      value
    })

    if (value.length === 1) { dispatch(setClientId(value[0].id)) }
  }
}

export function setFloors(floors, flexiplace) {
  return {
    type:  MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS,
    value: floors,
    flexiplace
  }
}

export function formatTo() {
  return (dispatch, getState) => {
    const {
      from, to, minDuration, maxDuration, duration
    } = getState().newReservation
    const fromValue = from
      ? moment(roundTime(from), MOMENT_DATETIME_FORMAT_MOBILE)
      : moment(roundTime(moment()))

    let toValue = to
      ? moment(roundTime(to), MOMENT_DATETIME_FORMAT_MOBILE)
      : fromValue.clone().add(duration, 'hours')

    const originalTo = toValue.clone()

    if (
      toValue.isValid()
      && toValue.diff(fromValue, 'minutes') < minDuration
    ) {
      toValue = fromValue.clone().add(minDuration, 'minutes')
    }
    if (
      maxDuration
      && toValue.isValid()
      && toValue.diff(fromValue, 'minutes') > maxDuration
    ) {
      toValue = fromValue.clone().add(maxDuration, 'minutes')
    }

    if (!toValue.isSame(originalTo)) {
      dispatch({
        type:  MOBILE_NEW_RESERVATION_SET_TO,
        value: toValue.format(MOMENT_DATETIME_FORMAT_MOBILE)
      })
    }
  }
}

export function setMinMaxDuration() {
  return (dispatch, getState) => {
    const {
      from, to, garage, duration
    } = getState().newReservation
    const isGoInternal = isPlaceGoInternal(getState().newReservation)
    const client = dispatch(selectedClient())

    const determineDuration = minOrMax => (
      (
        garage && (
          isGoInternal
            ? garage[`${minOrMax}_reservation_duration_go_internal`]
            : garage[`${minOrMax}_reservation_duration_go_public`]
        )
      )
      || (client ? client[`${minOrMax}_reservation_duration`] : null)
    )

    const minDuration = determineDuration('min')
    const maxDuration = determineDuration('max')

    // set min/max duration of garage or of client
    dispatch(setMinDuration(minDuration))
    dispatch(setMaxDuration(maxDuration))
    // does reservation meet min/max boundaries
    let diff
    if (duration) {
      diff = duration * 60
    } else {
      diff = moment(to, MOMENT_DATETIME_FORMAT_MOBILE)
        .diff(moment(from, MOMENT_DATETIME_FORMAT_MOBILE), 'minutes')
    }

    if ((minDuration && diff < minDuration) || (maxDuration && diff > maxDuration)) {
      dispatch(formatTo())
    }
  }
}

export function setPlace(id) {
  return dispatch => {
    dispatch({
      type:  MOBILE_NEW_RESERVATION_SET_PLACE_ID,
      value: id
    })
    dispatch(setAutoselect(false))
    dispatch(setMinMaxDuration())
  }
}

export function getAvailableClients(changingGarage = false) {
  return async (dispatch, getState) => {
    const state = getState().newReservation
    const { mobileHeader } = getState()
    const {
      reservable_clients: reservableClients,
      last_reservation_client: lastReservationClient
    } = await requestPromise(
      GET_AVAILABLE_CLIENTS,
      {
        user_id:   state.guestReservation ? state.user_id : mobileHeader.current_user.id,
        garage_id: mobileHeader.garage_id
      }
    )

    if (lastReservationClient) { // I see client from last reservation
      const client = (
        reservableClients.findById(lastReservationClient.id)
      )
      client
      && (state.client_id == null || changingGarage)
      && state.client_id !== client.id
      && dispatch(setClientId(client.id))
    } else {
      reservableClients.findById(state.client_id) === undefined
      && state.client_id !== null
      && dispatch(setClientId(null))
    }
    dispatch(setAvailableClients(reservableClients))
  }
}

export function getAvailableCars() {
  return (dispatch, getState) => {
    const {
      guestReservation,
      user_id: userId,
      car_id: carId
    } = getState().newReservation
    const { current_user: currentUser } = getState().mobileHeader
    const id = guestReservation ? userId : currentUser && currentUser.id

    if (id) {
      const onCars = response => {
        const { user: { reservable_cars: reservableCars } } = response.data
        dispatch(setAvailableCars(reservableCars))
        dispatch(setCustomModal())
        if (carId !== null) { return }
        if (reservableCars.length === 1) {
          dispatch(setCarId(reservableCars[0].id))
        } else {
          dispatch(setCarId(null))
        }
      }

      request(onCars, GET_USER, { id })
    } else {
      dispatch(setAvailableCars([]))
    }
  }
}

export function getAvailableUsers() {
  return (dispatch, getState) => {
    if (getState().newReservation.guestReservation) {
      const { garage_id: garageId, current_user: currentUser } = getState().mobileHeader

      requestPromise(
        GET_AVAILABLE_USERS,
        { garage_id: garageId }
      )
        .then(data => {
          dispatch(setAvailableUsers(
            data.reservable_users.filter(user => user.id !== currentUser.id)
          ))
          dispatch(setCustomModal())
        })
    }
  }
}

export function setDuration(duration) {
  return (dispatch, getState) => {
    if (getState().newReservation.duration !== duration) {
      dispatch({
        type:  MOBILE_NEW_RESERVATION_SET_DURATION,
        value: duration
      })
      // if set to undefined, then setTo is going to take care of pickPlaces
      if (duration) {
        dispatch(pickPlaces())
      }
    }
  }
}

export function downloadReservation(id) {
  return async (dispatch, getState) => {
    const currentUserId = getState().mobileHeader.current_user.id
    dispatch(setCustomModal(t([ 'addFeatures', 'loading' ])))
    const { reservation } = await requestPromise(GET_RESERVATION, { id: parseInt(id, 10) })
    dispatch(setMobileHeaderGarage(reservation.place.floor.garage.id))
    if (reservation.user_id !== currentUserId) {
      dispatch(setUserId(reservation.user_id))
    }

    const [ client, { garage }, { user } ] = await Promise.all([
      requestPromise(GET_AVAILABLE_CLIENTS, {
        user_id:   getState().mobileHeader.current_user.id,
        garage_id: reservation.place.floor.garage.id
      }),
      requestPromise(GET_GARAGE, {
        id:             reservation.place.floor.garage.id,
        begins_at:      reservation.begins_at,
        ends_at:        reservation.ends_at,
        client_id:      reservation.client_id,
        reservation_id: reservation.id
      }),
      requestPromise(GET_USER, { id: getState().mobileHeader.current_user.id })
    ])

    let toSet = {
      reservation_id:  reservation.id,
      from:            moment(reservation.begins_at).format(MOMENT_DATETIME_FORMAT_MOBILE),
      to:              moment(reservation.ends_at).format(MOMENT_DATETIME_FORMAT_MOBILE),
      // availableClients: client.reservable_clients,
      client_id:       reservation.client_id,
      car_id:          reservation.car && !reservation.car.temporary ? reservation.car.id : null,
      carLicencePlate: reservation.car && reservation.car.temporary
        ? reservation.car.licence_plate
        : null,
      garage,
      place_id:        reservation.place.id,
      fromNow:         false,
      duration:        null,
      autoselect:      false,
      availableFloors: garage.floors,
      flexiplace:      garage.flexiplace
    }
    if (reservation.user_id === currentUserId) {
      toSet = {
        ...toSet,
        availableCars: user.reservable_cars,
        user_id:       null
      }
    } else {
      dispatch(getAvailableUsers())
    }

    dispatch(setAvailableClients(client.reservable_clients))
    dispatch(batchActions([
      {
        type: MOBILE_NEW_RESERVATION_SET_ALL,
        ...toSet
      },
      setCustomModal()
    ], 'MOBILE_NEW_RESERVATION_SET_ALL_PLUS_MODAL'))
    dispatch(setMinMaxDuration())
  }
}

export function initReservation(id) {
  return (dispatch, getState) => {
    const { personal, current_user: currentUser } = getState().mobileHeader
    dispatch(setCustomModal(t([ 'addFeatures', 'loading' ])))
    if (id) {
      if (getState().newReservation.reservation_id !== parseInt(id, 10)) {
        dispatch(downloadReservation(id))
      } else {
        dispatch(setCustomModal())
      }
    } else {
      dispatch(setReservationId())
      dispatch(pickPlaces())
      dispatch(getAvailableCars())
      dispatch(getAvailableUsers())
      if (personal) {
        dispatch({ type: MOBILE_NEW_RESERVATION_SET_USER_ID, value: currentUser.id })
      }
    }
  }
}

export function roundTime(time) {
  return moment(time).set(
    'minute',
    toFifteenMinuteStep(moment(time).minutes())
  )
    .format(MOMENT_DATETIME_FORMAT_MOBILE) // .format(MOMENT_DATETIME_FORMAT)
}

export function fromBeforeTo(from, to) {
  return moment(from).isBefore(moment(to))
}

function stateToVariables(getState) {
  const state = getState().newReservation
  const from = state.fromNow ? timeToUTCmobile(roundTime(moment())) : timeToUTCmobile(state.from)
  const to = state.duration
    ? timeToUTCmobile(
      roundTime(moment(from, MOMENT_UTC_DATETIME_FORMAT).add(state.duration, 'hours'))
    )
    : timeToUTCmobile(state.to)
  const garageId = getState().mobileHeader.garage_id

  return ({
    place_id:      state.place_id,
    client_id:     state.client_id,
    car_id:        state.car_id,
    licence_plate: state.carLicencePlate,
    user_id:       state.user_id,
    garage_id:     garageId,
    begins_at:     from,
    ends_at:       to
  })
}

export function autoselectPlace() {
  return (dispatch, getState) => {
    const { newReservation } = getState()
    const freePlaces = newReservation
      .availableFloors
      .reduce((arr, floor) => { // free places,
        return arr
          .concat(floor.free_places.filter(place => {
            return newReservation.client_id === undefined ? place.pricing !== undefined : true
          }))
      }, [])

    dispatch(setPlace(freePlaces.length === 0 ? null : freePlaces[0].id))
    dispatch(setAutoselect(true))
  }
}

export function pickPlaces(noClientDownload) {
  return async (dispatch, getState) => {
    const variables = stateToVariables(getState)
    const state = getState().newReservation
    if (!variables.garage_id) {
      dispatch(setFloors([]))
      dispatch(autoselectPlace())
      dispatch(setCustomModal())
      return
    }

    !noClientDownload && dispatch(getAvailableClients())

    const { garage } = await requestPromise(
      GET_GARAGE,
      {
        id:             variables.garage_id,
        begins_at:      variables.begins_at,
        ends_at:        variables.ends_at,
        client_id:      variables.client_id,
        user_id:        state.guestReservation ? state.user_id : null,
        reservation_id: state.reservation_id
      }
    )

    const { place_id: placeId } = getState().newReservation
    dispatch(setFloors(garage.floors, garage.flexiplace))
    dispatch(setGarage(garage))
    dispatch(setCustomModal())

    if (
      !garage.floors.some(
        floor => floor.free_places.find(place => place.id === placeId)
      )
    ) {
      // autoselect place if selected place is not available anymore
      dispatch(autoselectPlace())
    }
  }
}

export function checkGarageChange(garageId, nextGarageId) {
  return dispatch => {
    if (garageId !== nextGarageId) {
      dispatch(pickPlaces(true))
      dispatch(getAvailableClients(true))
      dispatch(getAvailableUsers())
    }
  }
}

export function paymentUnsucessfull(callback) {
  return dispatch => {
    dispatch(setCustomModal(null))
    dispatch(setError(t([ 'mobileApp', 'newReservation', 'paymentUnsucessfull' ])))
    dispatch(clearForm())
    callback()
  }
}

export function paymentSucessfull(callback) {
  return dispatch => {
    dispatch(setCustomModal(null))
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

export function payReservation(url, callback = () => {}) {
  return dispatch => {
    dispatch(setCustomModal(t([ 'mobileApp', 'newReservation', 'redirecting' ])))
    if (window.cordova === undefined) { // development purposes - browser debuging
      window.location.replace(url)
    } else { // in mobile open InAppBrowser, when redirected back continue
      const inAppBrowser = cordova.InAppBrowser.open(
        url, '_blank', 'location=no,zoom=no,toolbar=no'
      )
      inAppBrowser.addEventListener('loadstart', event => {
        if (
          !event.url.includes('paypal')
          && !event.url.includes('csob.cz')
          && !event.url.includes('park-it-direct')
        ) { // no paypal in name means redirected back
          inAppBrowser.close()
          const parameters = parseParameters(event.url)
          if (parameters.success === 'true') {
            if (parameters.csob === 'true') {
              dispatch(paymentSucessfull(callback))
            } else {
              dispatch(finishReservation(parameters.token, callback))
            }
          } else {
            dispatch(paymentUnsucessfull(callback))
          }
        }
      })
    }
  }
}

function showReservationErrorModal(dispatch) {
  dispatch(setCustomModal(
    <div>
      <div>{t([ 'newReservation', 'reservationOnPlace' ])}</div>
      <RoundButton
        content={<span className="fa fa-check" aria-hidden="true" />}
        onClick={() => dispatch(setCustomModal())}
        type="confirm"
      />
    </div>
  ))
}

export function submitReservation(callback) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      const res = response.data.create_reservation_new || response.data.update_reservation_new

      if (!res.reservation && res.errors) {
        showReservationErrorModal(dispatch)
        callback()
      }

      const { payment_url: paymentUrl } = res.reservation
      if (paymentUrl) {
        dispatch(payReservation(paymentUrl, callback))
      } else {
        dispatch(setCustomModal())
        dispatch(clearForm())
        callback()
      }
    }

    const reservation = stateToVariables(getState)
    const state = getState().newReservation
    dispatch(setCustomModal(
      state.reservation_id
        ? t([ 'mobileApp', 'newReservation', 'updatingReservation' ])
        : reservation.client_id
          ? t([ 'mobileApp', 'newReservation', 'creatingReservation' ])
          : t([ 'mobileApp', 'newReservation', 'creatingPayment' ])
    ))

    request(onSuccess, state.reservation_id ? UPDATE_RESERVATION_NEW : CREATE_RESERVATION_NEW, {
      id:          state.reservation_id,
      reservation: {
        user_id:       reservation.user_id || getState().mobileHeader.current_user.id,
        place_id:      reservation.place_id,
        client_id:     reservation.client_id === 0 ? undefined : reservation.client_id,
        car_id:        reservation.car_id,
        licence_plate: reservation.licence_plate === '' ? undefined : reservation.licence_plate,
        url:           window.cordova === undefined
          ? window.location.href.split('?')[0] // development purposes - browser debuging
          : entryPoint.includes('alpha')
            ? 'https://pid-alpha.herokuapp.com/#/en/reservations/newReservation/overview/'
            : 'https://pid-beta.herokuapp.com/#/en/reservations/newReservation/overview/',
        begins_at: reservation.begins_at,
        ends_at:   reservation.ends_at
      }
    })
  }
}


export function submitGuestReservation(callback) {
  return (dispatch, getState) => {
    const { newGuest } = getState()
    const state = getState().newReservation
    if (state.user_id === -1) {
      requestPromise(USER_AVAILABLE, {
        user: {
          email:     newGuest.email.value.toLowerCase(),
          full_name: newGuest.name.value,
          phone:     newGuest.phone.value.replace(/\s/g, ''),
          language:  getState().mobileHeader.current_user.language
        },
        client_user: state.client_id ? {
          client_id: +state.client_id,
          host:      true,
          message:   [
            'clientInvitationMessage',
            state.availableClients.findById(state.client_id).name
          ].join(';')
        } : null
      }).then(data => {
        if (data.user_by_email !== null) { // if the user exists
          // invite to client
          if (state.client_id) { // if client is selected then invite as host
            requestPromise(ADD_CLIENT_USER, {
              user_id:     data.user_by_email.id,
              client_user: {
                client_id: +state.client_id,
                host:      true,
                message:   [
                  'clientInvitationMessage',
                  state.availableClients.findById(state.client_id).name
                ].join(';')
              }
            }).then(() => {
              dispatch(setUserId(data.user_by_email.id))
              dispatch(submitReservation(callback))
            })
          } else { // no client selected, create reservation
            dispatch(setUserId(data.user_by_email.id))
            dispatch(submitReservation(callback))
          }
        } else { // user is current user
          dispatch(submitReservation(callback))
        }
      })
    } else {
      dispatch(submitReservation(callback))
    }
  }
}

export function checkReservation(reservation, callback = () => {}) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setCustomModal())
      if (response.data.paypal_check_validity) {
        dispatch(payReservation(reservation.payment_url, callback))
      } else {
        dispatch(setError(t([ 'mobileApp', 'newReservation', 'tokenNoLongerValid' ])))
        callback()
      }
    }

    const onCSOBSuccess = response => {
      dispatch(setCustomModal())
      dispatch(payReservation(response.data.csob_pay_reservation, callback))
    }

    if (reservation.payment_url.includes('csob.cz')) {
      dispatch(setCustomModal(t([ 'mobileApp', 'newReservation', 'creatingPayment' ])))
      request(
        onCSOBSuccess,
        CREATE_CSOB_PAYMENT,
        { id: reservation.id, url: window.location.href.split('?')[0] }
      )
    } else {
      dispatch(setCustomModal(t([ 'mobileApp', 'newReservation', 'checkingToken' ])))
      request(onSuccess, CHECK_VALIDITY, { token: parseParameters(url).token })
    }
  }
}

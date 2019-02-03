import moment from 'moment'

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
import { setError, setCustomModal, setGarage } from './mobile.header.actions'

import { GET_AVAILABLE_FLOORS, GET_AVAILABLE_USERS } from '../queries/mobile.newReservation.queries'
import {
  CREATE_RESERVATION,
  UPDATE_RESERVATION,
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


export const setAvailableCars = actionFactory(MOBILE_NEW_RESERVATION_AVAILABLE_CARS)
export const setCarId = actionFactory(MOBILE_NEW_RESERVATION_CAR_ID)
export const setCarLicencePlate = actionFactory(MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE)
export const setAutoselect = actionFactory(MOBILE_NEW_RESERVATION_SET_AUTOSELECT)
export const clearForm = actionFactory(MOBILE_NEW_RESERVATION_CLEAR_FORM)
export const setReservationId = actionFactory(MOBILE_NEW_RESERVATION_SET_RESERVATION_ID)
export const setGuestReservation = actionFactory(MOBILE_NEW_RESERVATION_SET_GUEST_RESERVATION)
export const setAvailableUsers = actionFactory(MOBILE_NEW_RESERVATION_SET_AVAILABLE_USERS)

export function setUserId(value) {
  return dispatch => {
    dispatch({ type: MOBILE_NEW_RESERVATION_SET_USER_ID, value })
    value && dispatch(getAvailableCars())
    value && dispatch(getAvailableClients())
  }
}

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
    } else if (getState().mobileNewReservation.to !== to) {
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
  }
}

export function setAvailableClients(value) {
  return (dispatch, getState) => {
    if (!getState().mobileNewReservation.guestReservation) {
      value.unshift({ name: t([ 'mobileApp', 'newReservation', 'me' ]), id: undefined })
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

export function setPlace(id) {
  return dispatch => {
    dispatch({
      type:  MOBILE_NEW_RESERVATION_SET_PLACE_ID,
      value: id
    })
    dispatch(setAutoselect(false))
  }
}

export function setMinMaxDuration() {
  return (dispatch, getState) => {
    const state = getState().mobile.NewReservation
    const isGoInternal = isPlaceGoInternal(state)
    const client = dispatch(selectedClient())

    const determineDuration = minOrMax => (state.garage && (isGoInternal
      ? state.garage[`${minOrMax}_reservation_duration_go_internal`]
      : state.garage[`${minOrMax}_reservation_duration_go_public`]))
      || (client ? client[`${minOrMax}_reservation_duration`] : null)

    const minDuration = determineDuration('min')
    const maxDuration = determineDuration('max')

    // set min/max duration of garage or of client
    dispatch(setMinDuration(minDuration))
    dispatch(setMaxDuration(maxDuration))
    // does reservation meet min/max boundaries
    const diff = moment(state.to, MOMENT_DATETIME_FORMAT)
      .diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'minutes')
    if ((minDuration && diff < minDuration) || (maxDuration && diff > maxDuration)) {
      dispatch(formatTo())
    }
  }
}

export function getAvailableClients() {
  return (dispatch, getState) => {
    const state = getState().mobileNewReservation
    const { mobileHeader } = getState()

    const onClients = response => {
      const {
        reservable_clients: reservableClients,
        last_reservation_client: lastReservationClient
      } = response.data
      if (lastReservationClient) { // I see client from last reservation
        const client = (
          reservableClients.findById(lastReservationClient.id)
        )
        client
        && !state.client_id
        && state.client_id !== client.id
        && dispatch(setClientId(client.id))
      } else {
        reservableClients.findById(state.client_id) === undefined
        && state.client_id !== undefined
        && dispatch(setClientId(undefined))
      }
      dispatch(setAvailableClients(reservableClients))
    }

    request(onClients, GET_AVAILABLE_CLIENTS, {
      user_id:   state.guestReservation ? state.user_id : mobileHeader.current_user.id,
      garage_id: mobileHeader.garage_id
    })
  }
}

export function getAvailableCars() {
  return (dispatch, getState) => {
    const {
      guestReservation,
      user_id: userId,
      car_id: carId
    } = getState().mobileNewReservation
    const { current_user: currentUser } = getState().mobileHeader
    const id = guestReservation ? userId : currentUser && currentUser.id

    if (id) {
      const onCars = response => {
        const { user: { reservable_cars: reservableCars } } = response.data
        dispatch(setAvailableCars(reservableCars))
        dispatch(setCustomModal())
        if (carId !== undefined) { return }
        if (reservableCars.length === 1) {
          dispatch(setCarId(reservableCars[0].id))
        } else {
          dispatch(setCarId(undefined))
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
    if (getState().mobileNewReservation.guestReservation) {
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
    if (getState().mobileNewReservation.duration !== duration) {
      dispatch({
        type:  MOBILE_NEW_RESERVATION_SET_DURATION,
        value: duration
      })
      // if set to undefined, then setTo is going to take care of pickPlaces
      if (duration !== undefined) {
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
    dispatch(setGarage(reservation.place.floor.garage.id))
    if (reservation.user_id !== currentUserId) {
      dispatch(setUserId(reservation.user_id))
    }

    const [ client, garage, user ] = await Promise.all([
      requestPromise(GET_AVAILABLE_CLIENTS, {
        user_id:   getState().mobileHeader.current_user.id,
        garage_id: reservation.place.floor.garage.id
      }),
      requestPromise(GET_AVAILABLE_FLOORS, {
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
      car_id:          !reservation.car.temporary ? reservation.car.id : undefined,
      carLicencePlate: reservation.car.temporary
        ? reservation.car.licence_plate
        : undefined,
      availableFloors: garage.garage.floors,
      place_id:        reservation.place.id,
      fromNow:         false,
      duration:        undefined,
      autoselect:      false
    }
    if (reservation.user_id === currentUserId) {
      toSet = {
        ...toSet,
        availableCars: user.user.reservable_cars,
        user_id:       undefined
      }
    } else {
      dispatch(getAvailableUsers())
    }

    dispatch(setAvailableClients(client.reservable_clients))
    dispatch({
      type: MOBILE_NEW_RESERVATION_SET_ALL,
      ...toSet
    })
    dispatch(setCustomModal())
  }
}

export function initReservation(id) {
  return (dispatch, getState) => {
    dispatch(setCustomModal(t([ 'addFeatures', 'loading' ])))
    if (id) {
      if (getState().mobileNewReservation.reservation_id !== parseInt(id, 10)) {
        dispatch(downloadReservation(id))
      } else {
        dispatch(setCustomModal())
      }
    } else {
      dispatch(setReservationId())
      dispatch(pickPlaces())
      dispatch(getAvailableCars())
      dispatch(getAvailableUsers())
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
  const state = getState().mobileNewReservation
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
    const { mobileNewReservation } = getState()
    const freePlaces = mobileNewReservation
      .availableFloors
      .reduce((arr, floor) => { // free places,
        return arr
          .concat(floor.free_places.filter(place => {
            return mobileNewReservation.client_id === undefined ? place.pricing !== undefined : true
          }))
      }, [])

    dispatch(setPlace(freePlaces.length === 0 ? undefined : freePlaces[0].id))
    dispatch(setAutoselect(true))
  }
}

export function pickPlaces(noClientDownload) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      const { garage } = response.data
      const { place_id: placeId } = getState().mobileNewReservation
      dispatch(setFloors(garage.floors, garage.flexiplace))
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

    const variables = stateToVariables(getState)
    const state = getState().mobileNewReservation
    if (variables.garage_id) {
      request(
        onSuccess,
        GET_AVAILABLE_FLOORS,
        {
          id:             variables.garage_id,
          begins_at:      variables.begins_at,
          ends_at:        variables.ends_at,
          client_id:      variables.client_id,
          user_id:        state.guestReservation ? state.user_id : null,
          reservation_id: state.reservation_id
        }
      )
      !noClientDownload && dispatch(getAvailableClients())
    } else {
      dispatch(setFloors([]))
      dispatch(autoselectPlace())
      dispatch(setCustomModal())
    }
  }
}

export function checkGarageChange(garageId, nextGarageId) {
  return dispatch => {
    if (garageId !== nextGarageId) {
      dispatch(pickPlaces())
      dispatch(getAvailableClients())
      dispatch(getAvailableUsers())
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

export function submitReservation(callback) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      const res = response.data.create_reservation || response.data.update_reservation
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
    const state = getState().mobileNewReservation
    dispatch(setCustomModal(
      state.reservation_id
        ? t([ 'mobileApp', 'newReservation', 'updatingReservation' ])
        : reservation.client_id
          ? t([ 'mobileApp', 'newReservation', 'creatingReservation' ])
          : t([ 'mobileApp', 'newReservation', 'creatingPayment' ])
    ))

    request(onSuccess, state.reservation_id ? UPDATE_RESERVATION : CREATE_RESERVATION, {
      id:          state.reservation_id,
      reservation: {
        user_id:       reservation.user_id || getState().mobileHeader.current_user.id,
        place_id:      reservation.place_id,
        client_id:     reservation.client_id,
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
    const state = getState().mobileNewReservation
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

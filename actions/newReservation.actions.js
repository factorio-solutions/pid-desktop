import React from 'react'
import moment from 'moment'
import { batchActions } from 'redux-batched-actions'

import request                       from '../helpers/request'
import actionFactory                     from '../helpers/actionFactory'
import requestPromise                    from '../helpers/requestPromise'
import * as nav                          from '../helpers/navigation'
import { t, getLanguage }                from '../modules/localization/localization'
import {
  calculatePrice,
  valueAddedTax,
  calculateDuration
} from '../helpers/calculatePrice'

import {
  MOMENT_DATETIME_FORMAT,
  MOMENT_DATE_FORMAT,
  MOMENT_TIME_FORMAT,
  timeToUTC
} from '../helpers/time'
import * as pageBaseActions from './pageBase.actions'


import {
  GET_AVAILABLE_USERS,
  GET_AVAILABLE_GARAGES,
  GET_AVAILABLE_CLIENTS,
  GET_USER,
  GET_GARAGE_DETAILS,
  GET_GARAGE_DETAILS_LIGHT,
  CREATE_RESERVATION_NEW,
  UPDATE_RESERVATION_NEW,
  GET_RESERVATION,
  GET_GARAGE_FREE_INTERVAL
} from '../queries/newReservation.queries'

import {
  USER_AVAILABLE,
  ADD_CLIENT_USER
} from '../queries/inviteUser.queries'

// const MIN_RESERVATION_DURATION = 30 // minutes


export const NEW_RESERVATION_SET_USER = 'NEW_RESERVATION_SET_USER'
export const NEW_RESERVATION_SET_NOTE = 'NEW_RESERVATION_SET_NOTE'
export const NEW_RESERVATION_SET_AVAILABLE_USERS = 'NEW_RESERVATION_SET_AVAILABLE_USERS'
export const NEW_RESERVATION_SET_RESERVATION = 'NEW_RESERVATION_SET_RESERVATION'
export const NEW_RESERVATION_SET_HOST_NAME = 'NEW_RESERVATION_SET_HOST_NAME'
export const NEW_RESERVATION_SET_HOST_PHONE = 'NEW_RESERVATION_SET_HOST_PHONE'
export const NEW_RESERVATION_SET_HOST_EMAIL = 'NEW_RESERVATION_SET_HOST_EMAIL'
export const NEW_RESERVATION_SET_HOST_LANGUAGE = 'NEW_RESERVATION_SET_HOST_LANGUAGE'
export const NEW_RESERVATION_SET_CLIENT_ID = 'NEW_RESERVATION_SET_CLIENT_ID'
export const NEW_RESERVATION_SET_PAID_BY_HOST = 'NEW_RESERVATION_SET_PAID_BY_HOST'
export const NEW_RESERVATION_SET_RECURRING_RULE = 'NEW_RESERVATION_SET_RECURRING_RULE'
export const NEW_RESERVATION_SHOW_RECURRING = 'NEW_RESERVATION_SHOW_RECURRING'
export const NEW_RESERVATION_SET_USE_RECURRING = 'NEW_RESERVATION_SET_USE_RECURRING'
export const NEW_RESERVATION_SET_RECURRING_RESERVATION_ID = 'NEW_RESERVATION_SET_RECURRING_RESERVATION_ID'
export const NEW_RESERVATION_CAR_ID = 'NEW_RESERVATION_CAR_ID'
export const NEW_RESERVATION_CAR_LICENCE_PLATE = 'NEW_RESERVATION_CAR_LICENCE_PLATE'
export const NEW_RESERVATION_SET_GARAGE = 'NEW_RESERVATION_SET_GARAGE'
export const NEW_RESERVATION_SET_FROM = 'NEW_RESERVATION_SET_FROM'
export const NEW_RESERVATION_SET_TO = 'NEW_RESERVATION_SET_TO'
export const NEW_RESERVATION_SET_PLACE_ID = 'NEW_RESERVATION_SET_PLACE_ID'
export const NEW_RESERVATION_SET_PRICE = 'NEW_RESERVATION_SET_PRICE'
export const NEW_RESERVATION_SET_DURATION_DATE = 'NEW_RESERVATION_SET_DURATION_DATE'
export const NEW_RESERVATION_SET_LOADING = 'NEW_RESERVATION_SET_LOADING'
export const NEW_RESERVATION_SET_HIGHLIGHT = 'NEW_RESERVATION_SET_HIGHLIGHT'
export const NEW_RESERVATION_SET_ERROR = 'NEW_RESERVATION_SET_ERROR'
export const NEW_RESERVATION_SET_SELECTED_TEMPLATE = 'NEW_RESERVATION_SET_SELECTED_TEMPLATE'
export const NEW_RESERVATION_SET_TEMPLATE_TEXT = 'NEW_RESERVATION_SET_TEMPLATE_TEXT'
export const NEW_RESERVATION_SET_SEND_SMS = 'NEW_RESERVATION_SET_SEND_SMS'
export const NEW_RESERVATION_SET_PAYMENT_METHOD = 'NEW_RESERVATION_SET_PAYMENT_METHOD'
export const NEW_RESERVATION_SET_CSOB_ONE_CLICK = 'NEW_RESERVATION_SET_CSOB_ONE_CLICK'
export const NEW_RESERVATION_SET_CSOB_ONE_CLICK_NEW_CARD = 'NEW_RESERVATION_SET_CSOB_ONE_CLICK_NEW_CARD'
export const NEW_RESERVATION_SET_MIN_DURATION = 'NEW_RESERVATION_SET_MIN_DURATION'
export const NEW_RESERVATION_SET_MAX_DURATION = 'NEW_RESERVATION_SET_MAX_DURATION'
export const NEW_RESERVATION_CLEAR_FORM = 'NEW_RESERVATION_CLEAR_FORM'
export const NEW_RESERVATION_SET_TIME_CREDIT_PRICE = 'NEW_RESERVATION_SET_TIME_CREDIT_PRICE'
export const NEW_RESERVATION_SET_PREFERED_GARAGE_ID = 'NEW_RESERVATION_SET_PREFERED_GARAGE_ID'
export const NEW_RESERVATION_SET_PREFERED_PLACE_ID = 'NEW_RESERVATION_SET_PREFERED_PLACE_ID'
export const NEW_RESERVATION_SET_FREE_INTERVAL = 'NEW_RESERVATION_SET_FREE_INTERVAL'
export const NEW_RESERVATION_SHOW_MAP = 'NEW_RESERVATION_SHOW_MAP'
export const NEW_RESERVATION_LAST_USER_WAS_SAVED = 'NEW_RESERVATION_LAST_USER_WAS_SAVED'


export const setAvailableUsers = actionFactory(NEW_RESERVATION_SET_AVAILABLE_USERS)
export const setReservation = actionFactory(NEW_RESERVATION_SET_RESERVATION)
export const setShowRecurring = actionFactory(NEW_RESERVATION_SHOW_RECURRING)
export const setRecurringReservationId = actionFactory(NEW_RESERVATION_SET_RECURRING_RESERVATION_ID)
export const setCarId = actionFactory(NEW_RESERVATION_CAR_ID)
export const setCarLicencePlate = actionFactory(NEW_RESERVATION_CAR_LICENCE_PLATE)
export const setFrom = actionFactory(NEW_RESERVATION_SET_FROM)
export const setTo = actionFactory(NEW_RESERVATION_SET_TO)
export const setDurationDate = actionFactory(NEW_RESERVATION_SET_DURATION_DATE)
export const setLoading = actionFactory(NEW_RESERVATION_SET_LOADING)
export const setHighlight = actionFactory(NEW_RESERVATION_SET_HIGHLIGHT)
export const setPaidByHost = actionFactory(NEW_RESERVATION_SET_PAID_BY_HOST)
export const setError = actionFactory(NEW_RESERVATION_SET_ERROR)
export const clearForm = actionFactory(NEW_RESERVATION_CLEAR_FORM)
export const setLanguage = actionFactory(NEW_RESERVATION_SET_HOST_LANGUAGE)
export const setSelectedTemplate = (value, template) => ({ type: NEW_RESERVATION_SET_SELECTED_TEMPLATE, value, template })
export const setTemplateText = actionFactory(NEW_RESERVATION_SET_TEMPLATE_TEXT)
export const selectPaymentMethod = actionFactory(NEW_RESERVATION_SET_PAYMENT_METHOD)
export const setPreferedGarageId = actionFactory(NEW_RESERVATION_SET_PREFERED_GARAGE_ID)
export const setPreferedPlaceId = actionFactory(NEW_RESERVATION_SET_PREFERED_PLACE_ID)
export const selectCsobOneClick = actionFactory(NEW_RESERVATION_SET_CSOB_ONE_CLICK)
export const selectCsobOneClickNewCard = actionFactory(NEW_RESERVATION_SET_CSOB_ONE_CLICK_NEW_CARD)
export const setMinDuration = actionFactory(NEW_RESERVATION_SET_MIN_DURATION)
export const setMaxDuration = actionFactory(NEW_RESERVATION_SET_MAX_DURATION)
export const setTimeCreditPrice = actionFactory(NEW_RESERVATION_SET_TIME_CREDIT_PRICE)
export const setFreeInterval = actionFactory(NEW_RESERVATION_SET_FREE_INTERVAL)
export const setClientId = actionFactory(NEW_RESERVATION_SET_CLIENT_ID)
export const showMap = actionFactory(NEW_RESERVATION_SHOW_MAP)
export const setLastUserWasSaved = actionFactory(NEW_RESERVATION_LAST_USER_WAS_SAVED)
export const setGarage = actionFactory(NEW_RESERVATION_SET_GARAGE)

const patternInputActionFactory = type => (value, valid) => ({ type, value: { value, valid } })
export const setHostName = patternInputActionFactory(NEW_RESERVATION_SET_HOST_NAME)
export const setHostPhone = patternInputActionFactory(NEW_RESERVATION_SET_HOST_PHONE)
export const setHostEmail = patternInputActionFactory(NEW_RESERVATION_SET_HOST_EMAIL)

const hideLoading = dispatch => { dispatch(pageBaseActions.setCustomModal(undefined)); dispatch(setLoading(false)) }

function showLoadingModal(show) {
  return dispatch => {
    dispatch(setLoading(show))
    dispatch(pageBaseActions.setCustomModal(show ? (<div>{t([ 'newReservation', 'loading' ])}</div>) : undefined))
  }
}

export function setUser(value) {
  return async (dispatch, getState) => {
    dispatch({
      type: NEW_RESERVATION_SET_USER,
      value
    })
    if (!value.availableClients.some(client => client.id === getState().newReservation.client_id)) { // preselected client no longer available
      await dispatch(setClient())
    }
  }
}

export function setNote(value) {
  return {
    type:  NEW_RESERVATION_SET_NOTE,
    value: value ? value.substring(0, 25) : '' // maximum allowed length
  }
}

export function setClient(id) {
  return async (dispatch, getState) => {
    const {
      user,
      selectedTemplate
    } = getState().newReservation

    const client = user && user.availableClients && user.availableClients.findById(id)
    let template
    if (client && client.sms_templates && selectedTemplate) {
      template = client.sms_templates.findById(selectedTemplate)
    }

    if (!template && selectedTemplate) {
      dispatch(setSendSms(false))
    }

    dispatch(setClientId(id))
    // TODO: Why download garage every time?
    getState().newReservation.garage && await dispatch(downloadGarage(getState().newReservation.garage.id))
    dispatch(setPrice())
    dispatch(setMinMaxDuration())
  }
}

export function setRecurringRule(value) {
  return (dispatch, getState) => {
    if (value) {
      const start = moment(value.starts, MOMENT_DATE_FORMAT)
      dispatch(setFrom(
        moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT)
          .year(start.year())
          .month(start.month())
          .date(start.date())
          .format(MOMENT_DATETIME_FORMAT)
      ))
      dispatch(formatFrom())
    }
    dispatch({
      type: NEW_RESERVATION_SET_RECURRING_RULE,
      value
    })
    dispatch(setPrice())
  }
}

export function setUseRecurring(event) {
  return {
    type:  NEW_RESERVATION_SET_USE_RECURRING,
    value: typeof event === 'boolean' ? event : event.target.checked
  }
}

function setAvailableClients() {
  return async (dispatch, getState) => {
    let { user } = getState().newReservation
    const { garage, reservation } = getState().newReservation
    const availableClients = [ { name: t([ 'newReservation', 'selectClient' ]), id: undefined } ]
    const { reservable_clients: reservableClients } = (
      await clientsPromise(
        user && user.id,
        garage && garage.id,
        reservation && reservation.id
      )
    );
    ({ user } = getState().newReservation)
    user && dispatch(setUser({
      ...user,
      availableClients: availableClients.concat(reservableClients)
    }))
  }
}

export function setSendSms(sendSms) {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const client = dispatch(selectedClient())
    let templateIndex
    let templateText = ''

    if (sendSms && client.sms_templates.length === 1) {
      templateIndex = 0
      templateText = client.sms_templates[0].template
    } else if (!state.selectedTemplate) {
      ({ templateText } = state)
    }

    dispatch({ type: NEW_RESERVATION_SET_SEND_SMS, value: sendSms })
    dispatch(setSelectedTemplate(templateIndex, templateText))
  }
}

export function removeDiacritics() {
  return (dispatch, getState) => {
    const state = getState().newReservation
    dispatch(setTemplateText(state.templateText.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))
  }
}

export function isPlaceGoInternal(state) {
  const places = state.garage
    ? state.garage.floors.reduce((acc, f) => [ ...acc, ...(f.places || f.free_places) ], [])
    : []
  const selectedPlace = places.findById(state.place_id)
  return state.garage
  && state.garage.has_payment_gate
  && state.client_id
  && selectedPlace
  && selectedPlace.go_internal
}

export function setFromDate(value) {
  return (dispatch, getState) => {
    const from = moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT)
    const fromDate = moment(value, MOMENT_DATE_FORMAT)
    const toValue = null
    from.set('year', fromDate.get('year'))
    from.set('month', fromDate.get('month'))
    from.set('date', fromDate.get('date'))
    dispatch({
      type:  NEW_RESERVATION_SET_FROM,
      value: from.format(MOMENT_DATETIME_FORMAT),
      to:    toValue
    })
    dispatch(formatFrom(true))
  }
}

export function setFromTime(value) {
  return (dispatch, getState) => {
    const from = moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT)
    const fromTime = moment(value, MOMENT_TIME_FORMAT)
    const toValue = null
    from.set('hour', fromTime.get('hour'))
    from.set('minute', fromTime.get('minute'))
    dispatch({
      type:  NEW_RESERVATION_SET_FROM,
      value: from.format(MOMENT_DATETIME_FORMAT),
      to:    toValue
    })
    dispatch(formatFrom(true))
  }
}

export function formatFrom(loadGarage = false) {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const fromValue = moment(roundTime(getState().newReservation.from), MOMENT_DATETIME_FORMAT)
    const currentFrom = fromValue.clone()
    let toValue = null

    const MIN_RESERVATION_DURATION = state.minDuration
    const MAX_RESERVATION_DURATION = state.maxDuration
    if (moment(state.to, MOMENT_DATETIME_FORMAT).isValid()
        && moment(state.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      toValue = fromValue.clone().add(MIN_RESERVATION_DURATION, 'minutes')
    }
    if (MAX_RESERVATION_DURATION
        && moment(state.to, MOMENT_DATETIME_FORMAT).isValid()
        && moment(state.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') > MAX_RESERVATION_DURATION) {
      toValue = fromValue.clone().add(MAX_RESERVATION_DURATION, 'minutes')
    }

    dispatch({
      type:  NEW_RESERVATION_SET_FROM,
      value: fromValue.format(MOMENT_DATETIME_FORMAT),
      to:    toValue ? toValue.format(MOMENT_DATETIME_FORMAT) : toValue
    })

    moment(toValue, MOMENT_DATETIME_FORMAT).diff(fromValue, 'months') >= 1 && dispatch(setUseRecurring(false))

    if (loadGarage || toValue || !currentFrom.isSame(fromValue)) {
      getState().newReservation.garage && dispatch(downloadGarage(getState().newReservation.garage.id))
      dispatch(setPrice())
    }
  }
}

export function setToDate(value) {
  return (dispatch, getState) => {
    const to = moment(getState().newReservation.to, MOMENT_DATETIME_FORMAT)
    const toDate = moment(value, MOMENT_DATE_FORMAT)
    const fromValue = null
    to.set('year', toDate.get('year'))
    to.set('month', toDate.get('month'))
    to.set('date', toDate.get('date'))
    dispatch({
      type:  NEW_RESERVATION_SET_TO,
      value: to.format(MOMENT_DATETIME_FORMAT),
      from:  fromValue
    })
    dispatch(formatTo(true))
  }
}

export function setToTime(value) {
  return (dispatch, getState) => {
    const to = moment(getState().newReservation.to, MOMENT_DATETIME_FORMAT)
    const toTime = moment(value, MOMENT_TIME_FORMAT)
    const fromValue = null
    to.set('hour', toTime.get('hour'))
    to.set('minute', toTime.get('minute'))
    dispatch({
      type:  NEW_RESERVATION_SET_TO,
      value: to.format(MOMENT_DATETIME_FORMAT),
      from:  fromValue
    })
    dispatch(formatTo(true))
  }
}

export function formatTo(loadGarage = false) {
  return (dispatch, getState) => {
    const state = getState().newReservation
    let toValue = moment(roundTime(state.to), MOMENT_DATETIME_FORMAT)
    const currentTo = toValue.clone()
    const fromValue = moment(state.from, MOMENT_DATETIME_FORMAT)

    const MIN_RESERVATION_DURATION = state.minDuration
    const MAX_RESERVATION_DURATION = state.maxDuration
    if (
      moment(state.to, MOMENT_DATETIME_FORMAT).isValid()
      && moment(state.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION
    ) {
      toValue = fromValue.clone().add(MIN_RESERVATION_DURATION, 'minutes')
    }
    if (
      MAX_RESERVATION_DURATION
      && moment(state.to, MOMENT_DATETIME_FORMAT).isValid()
      && moment(state.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') > MAX_RESERVATION_DURATION
    ) {
      toValue = fromValue.clone().add(MAX_RESERVATION_DURATION, 'minutes')
    }

    dispatch({
      type:  NEW_RESERVATION_SET_TO,
      value: toValue.format(MOMENT_DATETIME_FORMAT)
    })

    toValue.diff(fromValue, 'months') >= 1 && dispatch(setUseRecurring(false))

    if (loadGarage || !currentTo.isSame(toValue)) {
      state.garage && dispatch(downloadGarage(state.garage.id))
      dispatch(setPrice())
    }
  }
}


export function setPlace(place) {
  return dispatch => {
    dispatch({
      type:  NEW_RESERVATION_SET_PLACE_ID,
      value: place ? place.id : undefined
    })
    dispatch(setPrice())
    dispatch(setMinMaxDuration())
  }
}

export function setMinMaxDuration() {
  return (dispatch, getState) => {
    const state = getState().newReservation
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
    const diff = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'minutes')
    if ((minDuration && diff < minDuration) || (maxDuration && diff > maxDuration)) {
      dispatch(formatTo())
    }
  }
}

export function selectedClient() {
  return (dispatch, getState) => {
    const state = getState().newReservation
    return (state.user || state.user_id)
    && state.client_id
    && state.user.availableClients
    && state.user.availableClients.findById(state.client_id)
  }
}

export function setPrice() {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const from = moment(state.from, MOMENT_DATETIME_FORMAT)
    const to = moment(state.to, MOMENT_DATETIME_FORMAT)
    const client = dispatch(selectedClient())
    let selectedPlace = null
    if (state.place_id === undefined && state.garage && state.garage.flexiplace) {
      const freePlaces = state.garage.floors.reduce((acc, floor) => [ ...acc, ...floor.places ], [])
      selectedPlace = freePlaces.length && freePlaces[0]
    } else {
      selectedPlace = state.garage && state.garage.floors.reduce((acc, floor) => {
        return acc || floor.places.find(place => place.id === state.place_id)
      }, undefined)
    }

    dispatch(setTimeCreditPrice(
      client
        ? (state.recurringRule ? state.recurringRule.count || 1 : 1) * calculateDuration(from, to) * client.time_credit_price
        : undefined
    ))

    let price

    if (selectedPlace && selectedPlace.pricing) {
      price = calculatePrice(selectedPlace.pricing, from, to, state.garage.dic ? state.garage.vat : 0)
    }

    dispatch({
      type:  NEW_RESERVATION_SET_PRICE,
      value: selectedPlace && selectedPlace.pricing
        ? `${price} ${selectedPlace.pricing.currency.symbol}`
        : undefined
    })
  }
}

export function toggleHighlight() {
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().newReservation.highlight))
  }
}

export function durationChange(value) {
  return (dispatch, getState) => {
    dispatch(setTo(moment(getState().newReservation.from, 'DD.MM.YYYY HH:mm').add(value, 'hours').format('DD.MM.YYYY HH:mm')))
  }
}

export function roundTime(time) {
  return moment(time, MOMENT_DATETIME_FORMAT)
    .set(
      'minute',
      Math.floor(moment(time, MOMENT_DATETIME_FORMAT).minutes() / 15) * 15
    )
    .format(MOMENT_DATETIME_FORMAT)
}

export function availableUsers(currentUser) {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      if (response.data !== undefined) {
        const users = response.data.reservable_users
        if (currentUser && currentUser.secretary) { // if is secretary then can create new host
          users.push({
            full_name: t([ 'newReservation', 'newHost' ]),
            rights:    { host: true },
            id:        -1
          })
          users.push({
            full_name: t([ 'newReservation', 'newInternal' ]),
            rights:    { internal: true },
            id:        -1
          })
          users.push({
            full_name: t([ 'newReservation', 'onetimeVisit' ]),
            id:        -2
          })
        }

        resolve(users)
      } else {
        reject('Response has no data - available users')
      }
    }

    request(onSuccess, GET_AVAILABLE_USERS)
  })
}

export function setInitialStore(id) {
  return async (dispatch, getState) => {
    dispatch(setLoading(true))
    dispatch(pageBaseActions.setCustomModal(<div>{t([ 'newReservation', 'loading' ])}</div>))

    const availableUsersPromise = availableUsers(getState().pageBase.current_user)

    const editReservationPromise = new Promise((resolve, reject) => {
      if (id) {
        dispatch(setLoading(true))
        const onSuccess = response => {
          // dispatch(setLoading(false))
          if (response.hasOwnProperty('data')) {
            resolve(response.data)
          } else {
            reject('Response has no data - editReservation')
          }
        }

        request(onSuccess, GET_RESERVATION, { id: +id })
      } else {
        resolve(undefined)
      }
    })
    try {
      const values = await Promise.all([ availableUsersPromise, editReservationPromise ])
      const users = values[0]
      dispatch(setAvailableUsers(users))

      if (values[1] !== undefined) { // if reservation edit set details
        values[1].reservation.ongoing = moment(values[1].reservation.begins_at).isBefore(moment()) // editing ongoing reservation
        dispatch(batchActions([
          setNote(values[1].reservation.note),
          setReservation(values[1].reservation),
          setFrom(moment(values[1].reservation.begins_at).format(MOMENT_DATETIME_FORMAT)),
          setTo(moment(values[1].reservation.ends_at).format(MOMENT_DATETIME_FORMAT))
        ], 'SET_INFO_ABOUT_RESERVATION'))
        dispatch(setPlace(values[1].reservation.place))
        dispatch(setClient(values[1].reservation.client_id))
        await dispatch(downloadGarage(values[1].reservation.place.floor.garage.id, false))
        dispatch(downloadUser(values[1].reservation.user_id, undefined, true))
        if (values[1].reservation.car) {
          values[1].reservation.car.temporary
            ? dispatch(setCarLicencePlate(values[1].reservation.car.licence_plate))
            : dispatch(setCarId(values[1].reservation.car.id))
        }
      } else {
        const state = getState().newReservation
        dispatch(setReservation(undefined))
        !state.from && dispatch(setFrom(moment().format(MOMENT_DATETIME_FORMAT)))
        !state.to
        && dispatch(setTo(
          moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT)
            .add(state.minDuration, 'minutes').format(MOMENT_DATETIME_FORMAT)
        ))
        dispatch(formatFrom())
        dispatch(formatTo())
        if (users.length === 1) {
          dispatch(downloadUser(users[0].id, undefined))
        } else {
          hideLoading(dispatch)
        }
      }
      dispatch(setLoading(false))
    } catch (e) {
      hideLoading(dispatch)
      throw (e)
    }
  }
}

function clientsPromise(userId, garageId, reservationId) {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      if (response.data !== undefined) {
        resolve(response.data)
      } else {
        reject('Response has no data - available users')
      }
    }

    request(onSuccess, GET_AVAILABLE_CLIENTS, {
      user_id:        userId,
      garage_id:      garageId,
      reservation_id: reservationId
    })
  })
}

function userPromise(userId) {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      if (response.data !== undefined) {
        resolve(response.data)
      } else {
        reject('Response has no data - available users')
      }
    }

    request(onSuccess, GET_USER, { id: userId })
  })
}

function availableGaragesPromise(userId, reservationId) {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      if (response.data !== undefined) {
        resolve(response.data)
      } else {
        reject('Response has no data - available users')
      }
    }

    request(onSuccess, GET_AVAILABLE_GARAGES, {
      user_id:        userId,
      reservation_id: reservationId
    })
  })
}

export function downloadUser(id, rights) {
  return async (dispatch, getState) => {
    const { lastUserWasSaved, reservation } = getState().newReservation
    dispatch(showLoadingModal(true))

    const getUser = userPromise(id)

    const getAvailableGarages = availableGaragesPromise(id, reservation && reservation.id)

    let user
    let availableGarages

    try {
      [ user, availableGarages ] = [
        (await getUser).user,
        (await getAvailableGarages).reservable_garages
      ]
    } catch (error) {
      // [urgent]TODO: Change or remove error handling.
      console.log(error)
      dispatch(showLoadingModal(false))
      throw error
    }

    let availableClients
    let state = getState().newReservation
    if (state.garage && availableGarages.some(gar => gar.id === state.garage.id)) {
      ({ reservable_clients: availableClients } = (
        await clientsPromise(
          id,
          state.garage && state.garage.id,
          state.reservation && state.reservation.id
        )
      ))
    } else {
      dispatch(setGarage());
      ({ reservable_clients: availableClients } = (await clientsPromise()))
    }
    state = getState().newReservation
    if (!availableClients.some(client => client.id === state.client_id)) {
      dispatch(setClientId())
    }

    availableClients.unshift({ name: t([ 'newReservation', 'selectClient' ]), id: undefined })

    if (user) {
      dispatch(batchActions([
        setHostName(user.full_name, true),
        setHostPhone(user.phone, true),
        setHostEmail(user.email, true),
        setLanguage(user.language)
      ]))
    }

    dispatch(setUser({
      ...(user || { id }),
      availableGarages,
      availableClients,
      rights // Client user rights
    }))

    if (lastUserWasSaved && id < 0) {
      dispatch(batchActions([
        setHostPhone('', false),
        setHostEmail('', false),
        setLanguage(getLanguage()),
        setCarLicencePlate(''),
        setCarId()
      ]))
    }

    state = getState().newReservation
    // download garage
    if (
      !state.reservation
      && availableGarages
      && availableGarages.some(gar => gar.id === state.preferedGarageId)
    ) {
      await dispatch(downloadGarage(state.preferedGarageId, false))
      dispatch(setPreferedGarageId())
    }

    state = getState().newReservation
    if (user && user.reservable_cars.length === 1) { // if only one car available
      dispatch(setCarId(user.reservable_cars[0].id))
    } else if (!user
      || !user.reservable_cars
      || !user.reservable_cars.some(car => car.id === state.car_id)
    ) {
      dispatch(setCarId())
    }

    dispatch(setLastUserWasSaved(id > 0))
    dispatch(showLoadingModal(false))
  }
}

function downloadGaragePromise(id, state) {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      if (response.data !== undefined) {
        resolve(response.data)
      } else {
        reject('Response has no data - available users')
      }
    }

    const userId = state.reservation
      ? state.reservation.user_id
      : state.user.id
    request(
      onSuccess,
      // download only free places if got rest of details
      (
        id
        && id === (state.garage && state.garage.id)
          ? GET_GARAGE_DETAILS_LIGHT
          : GET_GARAGE_DETAILS
      ),
      {
        id:             id || state.garage.id,
        user_id:        userId,
        client_id:      state.client_id,
        begins_at:      timeToUTC(state.from),
        ends_at:        timeToUTC(state.to),
        reservation_id: state.reservation ? state.reservation.id : null
      }
    )
  })
}

function freeIntervalPromise(id, state) {
  return new Promise((resolve, reject) => {
    const setFreeIntervalSuccess = response => {
      if (response.data !== undefined) {
        resolve(response.data)
      } else {
        reject('Response has no data - free interval')
      }
    }

    request(
      setFreeIntervalSuccess,
      GET_GARAGE_FREE_INTERVAL,
      {
        id:             id || state.garage.id,
        user_id:        state.user.id,
        client_id:      state.client_id,
        begins_at:      timeToUTC(state.from),
        ends_at:        timeToUTC(state.to),
        reservation_id: state.reservation ? state.reservation.id : null
      }
    )
  })
}

export function downloadGarage(id, hideLoadingAfterRuntime = true) {
  return async (dispatch, getState) => {
    let state = getState().newReservation
    if (!(id && id === (state.garage && state.garage.id))) {
      dispatch(showLoadingModal(true))
    }

    const result = await downloadGaragePromise(id, state)
    // if full download,then full garage, if light download, then garage from state with updated free places
    const garage = result.garage.name ? result.garage : {
      ...state.garage,
      floors: state.garage.floors.map(floor => ({
        ...floor,
        free_places: result.garage.floors.findById(floor.id).free_places
      }))
    }

    garage.floors.forEach(floor => {
      floor.places.map(place => {
        place.available = floor.free_places.some(p => p.id === place.id) // set availability

        if (place.available && place.pricing) { // add tooltip to available places
          if (!place.go_internal && !garage.is_public) return place // dont add tooltip if not internal or public
          const { pricing } = place
          const { symbol } = pricing.currency
          const duration = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'hours')
          const pricePerHour = price => valueAddedTax(price, garage.dic ? garage.vat : 0)

          place.tooltip = (
            <div>
              <div>
                <span>
                  <b>
                    {`${t([ 'newReservation', 'price' ])}: `}
                  </b>
                  {pricing.flat_price
                    ? pricePerHour(pricing.flat_price)
                    : duration < 12
                      ? pricePerHour(pricing.exponential_12h_price)
                      : duration < 24
                        ? pricePerHour(pricing.exponential_day_price)
                        : duration < 168
                          ? pricePerHour(pricing.exponential_week_price)
                          : pricePerHour(pricing.exponential_month_price)
                  }
                  {symbol}
                  {t([ 'newReservation', 'perHour' ])}
                </span>
              </div>
              {pricing.weekend_price
              && (
                <div>
                  <span>
                    <b>
                      {`${t([ 'newReservation', 'weekendPrice' ])}: `}
                    </b>
                    {`${pricePerHour(pricing.weekend_price)} `}
                    {`${symbol} `}
                    {t([ 'newReservation', 'perHour' ])}
                  </span>
                </div>
              )}
            </div>
          )
        }

        return place
      })
    })

    const noFreePlaces = !garage.floors.some(floor => floor.free_places.length > 0)
    if (noFreePlaces) {
      const freeIntervalResult = await freeIntervalPromise(id, state)
      if (freeIntervalResult !== undefined) {
        dispatch(setFreeInterval(freeIntervalResult.garage.greatest_free_interval))
      }
    }

    dispatch(setGarage(garage))
    await dispatch(setAvailableClients())
    state = getState().newReservation
    if (!state.reservation) {
      dispatch(autoSelectPlace())
    }

    // Unselect place if it is no longer available
    if (state.place_id) {
      const selectedPlace = garage.floors.reduce((place, floor) => {
        return place || floor.places.find(p => p.id === state.place_id)
      }, undefined)
      if (selectedPlace && !selectedPlace.available) {
        dispatch(setPlace({ id: undefined }))
      }
    }

    hideLoadingAfterRuntime && dispatch(showLoadingModal(false))
  }
}

export function autoSelectPlace() {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const allPlaces = state.garage.floors
      .reduce((acc, floor) => [ ...acc, ...floor.places ], [])

    if (state.garage.flexiplace) {
      dispatch(setPlace(undefined))
    } else if (
      state.preferedPlaceId && allPlaces
        .filter(place => place.available)
        .findById(state.preferedPlaceId)
    ) { // prefered place from occupancy was set
      dispatch(setPlace(allPlaces.findById(state.preferedPlaceId)))
      dispatch(setPreferedPlaceId())
    } else if (!(state.place_id && state.garage.floors.some(floor => {
      return floor.places.some(place => place.available && place.id === state.place_id)
    }))) { // if place not selected or selected place not found in this garage
      const selectedPlace = state.garage.floors.reduce((highestPriorityPlace, floor) => {
        return floor.places.reduce((highestPriorityPlace, place) => {
          if (place.available && (highestPriorityPlace === undefined || highestPriorityPlace.priority < place.priority
                || (highestPriorityPlace.priority === place.priority && +highestPriorityPlace.label > +place.label))
          ) {
            return place
          } else {
            return highestPriorityPlace
          }
        }, highestPriorityPlace)
      }, undefined)
      dispatch(setPlace(selectedPlace))
    }
  }
}

// Reservation overview ///////////////////////////////////////////////////////
export function overviewInit() {
  return (dispatch, getState) => {
    const state = getState().newReservation

    if (
      state.user === undefined
      || (state.place_id === undefined && (state.garage && !state.garage.flexiplace))
      || state.from === ''
      || state.to === ''
    ) {
      nav.to('/reservations/newReservation')
    }
  }
}
// Reservation create / update \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function createUpdateReservationRequestAsync(state, urlGarageId, { userId, userName }) {
  const ongoing = state.reservation && state.reservation.ongoing
  const reservationId = state.reservation ? state.reservation.id : undefined
  const updatingReservation = reservationId !== undefined

  return requestPromise(
    updatingReservation ? UPDATE_RESERVATION_NEW : CREATE_RESERVATION_NEW,
    {
      reservation: {
        user_id:       userId,
        note:          state.note ? state.note : undefined,
        place_id:      state.place_id,
        garage_id:     state.garage.id,
        client_id:     state.client_id,
        paid_by_host:  ongoing ? undefined : state.client_id && state.paidByHost,
        car_id:        state.car_id,
        licence_plate: state.carLicencePlate === '' ? undefined : state.carLicencePlate,
        url:           ongoing
          ? undefined
          : window.location.href.split('?')[0] + `?garage_id=${urlGarageId}`,
        begins_at:      timeToUTC(state.from),
        ends_at:        timeToUTC(state.to),
        recurring_rule: state.useRecurring
          ? JSON.stringify(state.recurringRule)
          : undefined,
        recurring_reservation_id: state.recurring_reservation_id,
        send_sms:                 state.sendSMS,
        sms_text:                 state.templateText,
        payment_method:           ongoing || (state.client_id && !state.paidByHost)
          ? undefined
          : state.paymentMethod,
        csob_one_click:          state.csobOneClick,
        csob_one_click_new_card: state.csobOneClickNewCard,
        user_name:               userName
      },
      reservationId
    },
    'reservationMutation'
  )
}

function createUserAsync(state) {
  return requestPromise(USER_AVAILABLE, {
    user: {
      email:     state.email.value.toLowerCase(),
      full_name: state.name.value,
      phone:     state.phone.value.replace(/\s/g, ''),
      language:  state.language,
      onetime:   state.user.id === -2
    },
    client_user: state.client_id && state.user.id === -1 ? {
      client_id: +state.client_id,
      ...state.user.rights,
      message:   [
        'clientInvitationMessage',
        state.user.availableClients.findById(state.client_id).name
      ].join(';')
    } : null
  })
}

function inviteUserToClient(userId, state) {
  return requestPromise(ADD_CLIENT_USER, {
    user_id:     userId,
    client_user: {
      client_id: +state.client_id,
      ...state.user.rights,
      message:   [
        'clientInvitationMessage',
        state.user.availableClients.findById(state.client_id).name
      ].join(';')
    }
  })
}

async function afterCreateReservation(dispatch, getState, data) {
  const state = getState().newReservation
  const updatingReservation = state.reservation !== undefined

  try {
    const { reservation, errors } = (
      data[updatingReservation ? 'update_reservation_new' : 'create_reservation_new']
    )

    if (errors.length > 0) {
      const reservationOnPlace = errors.find(e => e.message === 'Place is occupied')
      if (reservationOnPlace) {
        // Some modal and update accessible places.
        dispatch(pageBaseActions.setError(t([ 'newReservation', 'reservationOnPlace' ])))
        dispatch(setPlace())
        await dispatch(downloadGarage(state.garage.id))
        if (updatingReservation) {
          dispatch(autoSelectPlace())
        }
      } else {
        throw Error('Cannot create reservation')
      }
    } else if (reservation && reservation.payment_url) {
      dispatch(pageBaseActions.setCustomModal(
        <div>
          {t([ 'newReservation', 'redirecting' ])}
        </div>
      ))
      window.location.replace(reservation.payment_url)
    } else {
      dispatch(pageBaseActions.setCustomModal(undefined))
      nav.to(`/reservations/find/${reservation.id}`)
      dispatch(clearForm())
    }
  } catch (err) {
    console.log(err)
    dispatch(pageBaseActions.setError(t([ 'newReservation', 'notAbleToCreateReservation' ])))
    nav.to('/reservations')
  }
}

async function sendNewReservationRequest(dispatch, getState) {
  // const changeUserName = id && state.user && state.user.onetime
  const state = getState().newReservation
  const urlGarageId = getState().pageBase.garage
  const changeUserName = state.reservation && state.user && state.user.onetime
  const args = {
    userName: changeUserName
      ? state.name.value
      : undefined,
    userId: state.user.id
  }

  // if  new Host being created during new reservation
  if (state.user && state.user.id < 0) {
    const { user_by_email: user } = await createUserAsync(state)
    // if the user exists
    if (user !== null) {
      // invite to client
      // if client is selected then invite as host
      if (state.client_id && state.user.id === -1) {
        const response = await inviteUserToClient(user.id, state)
        console.log('client successfully created', response)
        args.userName = null
      }
      args.userId = user.id
    } else {
      // user is current user
      args.userId = null
      args.userName = null
    }
  }

  const res = await createUpdateReservationRequestAsync(
    getState().newReservation,
    urlGarageId,
    args
  )
  await afterCreateReservation(dispatch, getState, res)
}

export function submitReservation(id) {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const updatingReservation = id !== undefined

    dispatch(pageBaseActions.setCustomModal(
      <div>
        {t([ 'newReservation', updatingReservation
          ? 'updatingReservation'
          : 'creatingReservation'
        ])}
      </div>
    ))

    // check if reservation is being created in the past - warn user about it
    const fromValue = moment(roundTime(state.from), MOMENT_DATETIME_FORMAT)
    const now = moment(roundTime(moment()), MOMENT_DATETIME_FORMAT)
    let {
      longterm_generating:  longTermGenerated,
      shortterm_generating: shortTermGenerated
    } = state.garage

    longTermGenerated = moment(longTermGenerated)
    shortTermGenerated = moment(shortTermGenerated)

    let invoicesAlreadyGenerated = false
    if (state.client_id && !state.paidByHost) {
      invoicesAlreadyGenerated = fromValue.isBefore(
        isPlaceGoInternal(state)
          ? shortTermGenerated
          : longTermGenerated
      )
    }

    if (
      fromValue.diff(now, 'minutes') < 0
      && invoicesAlreadyGenerated
    ) {
      dispatch(pageBaseActions.confirm(
        t([ 'newReservation', 'creatingReservationInPast' ]),
        () => sendNewReservationRequest(dispatch, getState)
      ))
    } else {
      sendNewReservationRequest(dispatch, getState)
    }
  }
}

// END Reservation create / update \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

export function afterPayment(id, success) {
  return dispatch => {
    if (success === 'false') {
      dispatch(pageBaseActions.setError(t([ 'newReservation', 'paymentUnsucessfull' ])))
    }
    const parsedId = parseInt(id, 10)
    if (typeof (parsedId) === 'number' && parsedId > 0) {
      nav.to(`/reservations/find/${parsedId}`)
    } else {
      nav.to('/reservations')
    }
  }
}

export function cancelUser() {
  return dispatch => {
    dispatch(setHostName(''))
    dispatch({
      type:  NEW_RESERVATION_SET_USER,
      value: undefined
    })
  }
}

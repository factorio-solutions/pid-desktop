import React from 'react'
import moment from 'moment'

import { request }                       from '../helpers/request'
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
  CREATE_RESERVATION,
  UPDATE_RESERVATION,
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
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_USER,
      value
    })
    if (!value.availableClients.some(client => client.id === getState().newReservation.client_id)) { // preselected client no longer available
      dispatch(setClient())
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
  return (dispatch, getState) => {
    const {
      user: {
        availableClients
      },
      selectedTemplate
    } = getState().newReservation

    const client = availableClients && availableClients.findById(id)
    let template
    if (client && client.sms_templates && selectedTemplate) {
      template = client.sms_templates.findById(selectedTemplate)
    }

    if (!template && selectedTemplate) {
      dispatch(setSendSms(false))
    }

    dispatch(setClientId(id))
    // TODO: Why download garage every time?
    getState().newReservation.garage && dispatch(downloadGarage(getState().newReservation.garage.id))
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
    dispatch({ type: NEW_RESERVATION_SET_RECURRING_RULE,
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

export function setGarage(value) {
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_GARAGE,
      value
    })
    // There were two available Clients requests because line #497 and #525
    const state = getState().newReservation
    if (typeof value === 'undefined') {
      state.user && dispatch(setUser({
        ...state.user,
        availableClients: [ { name: t([ 'newReservation', 'selectClient' ]), id: undefined } ]
      }))
    } else {
      const availableClientsPromise = clientsPromise(state.user && state.user.id, state.garage && state.garage.id)
      availableClientsPromise.then(value => {
        value.reservable_clients.unshift({ name: t([ 'newReservation', 'selectClient' ]), id: undefined })
        state.user && dispatch(setUser({ ...state.user, availableClients: value.reservable_clients }))
      }).catch(error => {
        throw (error)
      })
    }
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
      templateText = state.templateText
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
  const places = state.garage ? state.garage.floors.reduce((acc, f) => [ ...acc, ...f.places ], []) : []
  const selectedPlace = places.findById(state.place_id)
  return state.garage && state.garage.has_payment_gate && state.client_id && selectedPlace && selectedPlace.go_internal
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
    if (moment(state.to, MOMENT_DATETIME_FORMAT).isValid() &&
        moment(state.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      toValue = fromValue.clone().add(MIN_RESERVATION_DURATION, 'minutes')
    }
    if (MAX_RESERVATION_DURATION &&
        moment(state.to, MOMENT_DATETIME_FORMAT).isValid() &&
        moment(state.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') > MAX_RESERVATION_DURATION) {
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
    if (moment(state.to, MOMENT_DATETIME_FORMAT).isValid() &&
        moment(state.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION
    ) {
      toValue = fromValue.clone().add(MIN_RESERVATION_DURATION, 'minutes')
    }
    if (MAX_RESERVATION_DURATION &&
        moment(state.to, MOMENT_DATETIME_FORMAT).isValid() &&
        moment(state.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') > MAX_RESERVATION_DURATION
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
    dispatch({ type:  NEW_RESERVATION_SET_PLACE_ID,
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

    const determineDuration = minOrMax => (state.garage && (isGoInternal ?
      state.garage[`${minOrMax}_reservation_duration_go_internal`] :
      state.garage[`${minOrMax}_reservation_duration_go_public`])) ||
      (client ? client[`${minOrMax}_reservation_duration`] : null)

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
    return state.user &&
      state.client_id &&
      state.user.availableClients &&
      state.user.availableClients.findById(state.client_id)
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
  return moment(time, MOMENT_DATETIME_FORMAT).set('minute', Math.floor(moment(time, MOMENT_DATETIME_FORMAT).minutes() / 15) * 15).format(MOMENT_DATETIME_FORMAT)
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
  return (dispatch, getState) => {
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

    Promise.all([ availableUsersPromise, editReservationPromise ]).then(values => { // resolve
      const users = values[0]
      dispatch(setAvailableUsers(users))
      dispatch(setLoading(false))

      if (values[1] !== undefined) { // if reservation edit set details
        values[1].reservation.ongoing = moment(values[1].reservation.begins_at).isBefore(moment()) // editing ongoing reservation
        dispatch(setNote(values[1].reservation.note))
        dispatch(setReservation(values[1].reservation))
        dispatch(setClient(values[1].reservation.client_id))
        dispatch(downloadUser(values[1].reservation.user_id, undefined, true))
        if (values[1].reservation.car) {
          values[1].reservation.car.temporary ? dispatch(setCarLicencePlate(values[1].reservation.car.licence_plate)) : dispatch(setCarId(values[1].reservation.car.id))
        }
        dispatch(setFrom(moment(values[1].reservation.begins_at).format(MOMENT_DATETIME_FORMAT)))
        dispatch(setTo(moment(values[1].reservation.ends_at).format(MOMENT_DATETIME_FORMAT)))
        dispatch(setPlace(values[1].reservation.place))
      } else {
        const state = getState().newReservation
        dispatch(setReservation(undefined))
        !state.from && dispatch(setFrom(moment().format(MOMENT_DATETIME_FORMAT)))
        !state.to && dispatch(setTo(moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT).add(state.minDuration, 'minutes').format(MOMENT_DATETIME_FORMAT)))
        dispatch(formatFrom())
        dispatch(formatTo())
        if (users.length === 1) {
          dispatch(downloadUser(users[0].id, undefined))
        } else {
          hideLoading(dispatch)
        }
      }
    }).catch(error => { // error
      hideLoading(dispatch)
      throw (error)
    })
  }
}

export function downloadUser(id, rights, initEdit = false) {
  return async (dispatch, getState) => {
    const state = getState().newReservation
    const { lastUserWasSaved } = state
    dispatch(showLoadingModal(true))

    const userPromise = new Promise((resolve, reject) => {
      const onSuccess = response => {
        if (response.data !== undefined) {
          resolve(response.data)
        } else {
          reject('Response has no data - available users')
        }
      }

      request(onSuccess, GET_USER, { id })
    })

    const availableGaragesPromise = new Promise((resolve, reject) => {
      const onSuccess = response => {
        if (response.data !== undefined) {
          resolve(response.data)
        } else {
          reject('Response has no data - available users')
        }
      }

      request(onSuccess, GET_AVAILABLE_GARAGES, { user_id: id })
    })

    let user
    let availableGarages

    try {
      [ user, availableGarages ] = [
        (await userPromise).user,
        (await availableGaragesPromise).reservable_garages
      ]
    } catch (error) {
      // [urgent]TODO: Change or remove error handling.
      console.log(error)
      dispatch(showLoadingModal(false))
      throw error
    }

    let availableClients

    if (state.garage && availableGarages.some(gar => gar.id === state.garage.id)) {
      availableClients = (await clientsPromise(id, state.garage && state.garage.id)).reservable_clients
    } else {
      dispatch(setGarage())
      availableClients = (await clientsPromise()).reservable_clients
    }

    if (!availableClients.some(client => client.id === state.client_id)) {
      dispatch(setClientId())
    }

    availableClients.unshift({ name: t([ 'newReservation', 'selectClient' ]), id: undefined })

    dispatch(setUser({ ...(user || { id }),
      availableGarages,
      availableClients,
      rights // Client user rights
    }))

    if (user) {
      dispatch(setHostName(user.full_name, true))
      dispatch(setHostPhone(user.phone, true))
      dispatch(setHostEmail(user.email, true))
      dispatch(setLanguage(user.language))
    }

    if (lastUserWasSaved && id < 0) {
      dispatch(setHostPhone('', false))
      dispatch(setHostEmail('', false))
      dispatch(setLanguage(getLanguage()))
      dispatch(setCarLicencePlate(''))
      dispatch(setCarId())
    }

    if (getState().newReservation.reservation) { // download garage
      dispatch(downloadGarage(getState().newReservation.reservation.place.floor.garage.id))
    }

    if (availableGarages && availableGarages.findById(state.preferedGarageId)) {
      dispatch(downloadGarage(state.preferedGarageId))
      dispatch(setPreferedGarageId())
    }

    if (user && user.reservable_cars.length === 1) { // if only one car available
      dispatch(setCarId(user.reservable_cars[0].id))
    } else if (!user ||
      !user.reservable_cars ||
      !user.reservable_cars.some(car => car.id === state.car_id)
    ) {
      dispatch(setCarId())
    }

    dispatch(setLastUserWasSaved(id > 0))
    dispatch(showLoadingModal(false))
  }
}

function clientsPromise(userId, garageId) {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      if (response.data !== undefined) {
        resolve(response.data)
      } else {
        reject('Response has no data - available users')
      }
    }

    request(onSuccess, GET_AVAILABLE_CLIENTS, { user_id: userId, garage_id: garageId })
  })
}

export function downloadGarage(id) {
  return (dispatch, getState) => {
    const state = getState().newReservation
    new Promise((resolve, reject) => {
      const onSuccess = response => {
        if (response.data !== undefined) {
          resolve(response.data)
        } else {
          reject('Response has no data - available users')
        }
      }
      if (!(id && id === (state.garage && state.garage.id))) {
        dispatch(showLoadingModal(true))
      }

      request(
        onSuccess,
        (id && id === (state.garage && state.garage.id) ? GET_GARAGE_DETAILS_LIGHT : GET_GARAGE_DETAILS), // download only free places if got rest of details
        { id:             id || state.garage.id,
          user_id:        state.user.id,
          client_id:      state.client_id,
          begins_at:      timeToUTC(state.from),
          ends_at:        timeToUTC(state.to),
          reservation_id: state.reservation ? state.reservation.id : null
        }
      )
    }).then(value => {
      // if full download,then full garage, if light download, then garage from state with updated free places
      const garage = value.garage.name ? value.garage : {
        ...state.garage,
        floors: state.garage.floors.map(floor => ({
          ...floor,
          free_places: value.garage.floors.findById(floor.id).free_places
        }))
      }

      garage.floors.forEach(floor => {
        floor.places.map(place => {
          // if (state.reservation && state.reservation.ongoing) { // if ongoing reservation - only selected place might be available
          //   place.available = floor.free_places.find(p => p.id === place.id && p.id === state.reservation.place.id) !== undefined // set avilability
          // } else {
          //   place.available = floor.free_places.find(p => p.id === place.id) !== undefined // set avilability
          // }
          place.available = floor.free_places.find(p => p.id === place.id) !== undefined // set avilability

          if (place.available && place.pricing) { // add tooltip to available places
            if (!place.go_internal && !garage.is_public) return place // dont add tooltip if not internal or public
            const pricing = place.pricing
            const symbol = pricing.currency.symbol
            const duration = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'hours')
            const pricePerHour = price => valueAddedTax(price, garage.dic ? garage.vat : 0)

            place.tooltip = (<div>
              <div>
                <span>
                  <b>{t([ 'newReservation', 'price' ])}: </b>
                  { pricing.flat_price ? pricePerHour(pricing.flat_price) :
                    duration < 12 ? pricePerHour(pricing.exponential_12h_price) :
                    duration < 24 ? pricePerHour(pricing.exponential_day_price) :
                    duration < 168 ? pricePerHour(pricing.exponential_week_price) :
                    pricePerHour(pricing.exponential_month_price)
                  }
                  {symbol}
                  {t([ 'newReservation', 'perHour' ])}
                </span>
              </div>
              {pricing.weekend_price && <div>
                <span>
                  <b>{t([ 'newReservation', 'weekendPrice' ])}:</b> {pricePerHour(pricing.weekend_price)} {symbol} {t([ 'newReservation', 'perHour' ])}
                </span>
              </div>}
            </div>)
          }

          return place
        })
      })

      const noFreePlaces = garage.floors.find(floor => floor.free_places.length !== 0) === undefined
      if (noFreePlaces) {
        const setFreeIntervalSuccess = response => {
          if (response.data !== undefined) {
            dispatch(setFreeInterval(response.data.garage.greatest_free_interval))
          }
        }

        request(
          setFreeIntervalSuccess,
          GET_GARAGE_FREE_INTERVAL,
          { id:             id || state.garage.id,
            user_id:        state.user.id,
            client_id:      state.client_id,
            begins_at:      timeToUTC(state.from),
            ends_at:        timeToUTC(state.to),
            reservation_id: state.reservation ? state.reservation.id : null
          }
        )
      }

      dispatch(setGarage(garage))
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

      dispatch(showLoadingModal(false))
    })
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
                || (highestPriorityPlace.priority === place.priority && +highestPriorityPlace.label > +place.label))) {
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

    if (state.user === undefined || (state.place_id === undefined && (state.garage && !state.garage.flexiplace)) || state.from === '' || state.to === '') {
      nav.to('/reservations/newReservation')
    }
  }
}

export function submitReservation(id) {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const ongoing = state.reservation && state.reservation.ongoing

    const changeUserName = id && state.user && state.user.onetime

    const onSuccess = response => {
      try {
        if (response.data.create_reservation && response.data.create_reservation.payment_url) {
          dispatch(pageBaseActions.setCustomModal(<div>{t([ 'newReservation', 'redirecting' ])}</div>))
          window.location.replace(response.data.create_reservation.payment_url)
        } else {
          dispatch(pageBaseActions.setCustomModal(undefined))
          nav.to(`/reservations/find/${(response.data.update_reservation || response.data.create_reservation).id}`)
          dispatch(clearForm())
        }
      } catch (err) {
        dispatch(pageBaseActions.setError(t([ 'newReservation', 'notAbleToCreateReservation' ])))
        nav.to('/reservations')
      }
    }

    dispatch(pageBaseActions.setCustomModal(<div>{t([ 'newReservation', id ? 'updatingReservation' : 'creatingReservation' ])}</div>))

    const createTheReservation = (user_id, user_name) => {
      request(onSuccess,
        id ? UPDATE_RESERVATION : CREATE_RESERVATION,
        { reservation: {
          user_id,
          note:                     state.note ? state.note : undefined,
          place_id:                 state.place_id,
          garage_id:                state.garage.id,
          client_id:                state.client_id,
          paid_by_host:             ongoing ? undefined : state.client_id && state.paidByHost,
          car_id:                   state.car_id,
          licence_plate:            state.carLicencePlate === '' ? undefined : state.carLicencePlate,
          url:                      ongoing ? undefined : window.location.href.split('?')[0] + `?garage_id=${getState().pageBase.garage}`,
          begins_at:                timeToUTC(state.from),
          ends_at:                  timeToUTC(state.to),
          recurring_rule:           state.useRecurring ? JSON.stringify(state.recurringRule) : undefined,
          recurring_reservation_id: state.recurring_reservation_id,
          send_sms:                 state.sendSMS,
          sms_text:                 state.templateText,
          payment_method:           ongoing || (state.client_id && !state.paidByHost) ? undefined : state.paymentMethod,
          csob_one_click:           state.csobOneClick,
          csob_one_click_new_card:  state.csobOneClickNewCard,
          user_name
        },
          id
        },
        'reservationMutation'
      )
    }

    const sendNewReservationRequest = () => {
      if (state.user && state.user.id < 0) { // if  new Host being created during new reservation
        requestPromise(USER_AVAILABLE, {
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
            message:   [ 'clientInvitationMessage', state.user.availableClients.findById(state.client_id).name ].join(';')
          } : null
        }).then(data => {
          if (data.user_by_email !== null) { // if the user exists
            // invite to client
            if (state.client_id && state.user.id === -1) { // if client is selected then invite as host
              requestPromise(ADD_CLIENT_USER, {
                user_id:     data.user_by_email.id,
                client_user: {
                  client_id: +state.client_id,
                  ...state.user.rights,
                  message:   [ 'clientInvitationMessage', state.user.availableClients.findById(state.client_id).name ].join(';')
                }
              }).then(response => {
                console.log('client successfully created', response)
                createTheReservation(data.user_by_email.id)
              })
            } else { // no client selected, create reservation
              createTheReservation(data.user_by_email.id, changeUserName ? state.name.value : undefined)
            }
          } else { // user is current user
            createTheReservation()
          }
        })
      } else { // create reservation as normal
        createTheReservation(state.user.id, changeUserName ? state.name.value : undefined)
      }
    }

    // check if reservation is being created in the past - warn user about it
    const fromValue = moment(roundTime(state.from), MOMENT_DATETIME_FORMAT)
    const now = moment(roundTime(moment()), MOMENT_DATETIME_FORMAT)
    if (fromValue.diff(now, 'minutes') < 0) {
      dispatch(pageBaseActions.confirm(t([ 'newReservation', 'creatingReservationInPast' ]), sendNewReservationRequest))
    } else {
      sendNewReservationRequest()
    }
  }
}

export function afterPayment(id, success) {
  return dispatch => {
    if (success === 'false') {
      dispatch(pageBaseActions.setError(t([ 'newReservation', 'paymentUnsucessfull' ])))
    }
    const parsedId = parseInt(id, 10)
    if (typeof(parsedId) === 'number' && parsedId > 0) {
      nav.to(`/reservations/find/${parsedId}`)
    } else {
      nav.to('/reservations')
    }
  }
}

export function cancelUser() {
  return (dispatch, getState) => {
    const { user: { id } } = getState().newReservation
    if (id < 0) {
      dispatch(setHostName(''))
    }
    dispatch({ type:  NEW_RESERVATION_SET_USER,
      value: undefined
    })
  }
}

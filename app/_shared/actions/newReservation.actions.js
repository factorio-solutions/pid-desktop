import React from 'react'
import moment from 'moment'

import { request }                       from '../helpers/request'
import actionFactory                     from '../helpers/actionFactory'
import requestPromise                    from '../helpers/requestPromise'
import { calculatePrice, valueAddedTax } from '../helpers/calculatePrice'
import * as nav                          from '../helpers/navigation'
import { t }                             from '../modules/localization/localization'

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
  // PAY_RESREVATION,
  GET_RESERVATION,
  GET_GARAGE_FREE_INTERVAL
} from '../queries/newReservation.queries'

import {
  USER_AVAILABLE,
  ADD_CLIENT_USER
} from '../queries/inviteUser.queries'

const MIN_RESERVATION_DURATION = 30 // minutes


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
export const NEW_RESERVATION_CLEAR_FORM = 'NEW_RESERVATION_CLEAR_FORM'
export const NEW_RESERVATION_SET_FREE_INTERVAL = 'NEW_RESERVATION_SET_FREE_INTERVAL'


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
export const setSendSms = actionFactory(NEW_RESERVATION_SET_SEND_SMS)
export const setSelectedTemplate = (value, template) => ({ type: NEW_RESERVATION_SET_SELECTED_TEMPLATE, value, template })
export const setTemplateText = actionFactory(NEW_RESERVATION_SET_TEMPLATE_TEXT)
export const selectPaymentMethod = actionFactory(NEW_RESERVATION_SET_PAYMENT_METHOD)
export const setFreeInterval = actionFactory(NEW_RESERVATION_SET_FREE_INTERVAL)

const patternInputActionFactory = type => (value, valid) => ({ type, value: { value, valid } })
export const setHostName = patternInputActionFactory(NEW_RESERVATION_SET_HOST_NAME)
export const setHostPhone = patternInputActionFactory(NEW_RESERVATION_SET_HOST_PHONE)
export const setHostEmail = patternInputActionFactory(NEW_RESERVATION_SET_HOST_EMAIL)

const hideLoading = dispatch => { dispatch(pageBaseActions.setCustomModal(undefined)); dispatch(setLoading(false)) }

export function setUser(value) {
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_USER,
      value
    })
    if (value.availableClients.find(client => client.id === getState().newReservation.client_id) === undefined) { // preselected client no longer available
      dispatch(setClientId(undefined))
    }
  }
}

export function setNote(value) {
  return {
    type:  NEW_RESERVATION_SET_NOTE,
    value: value ? value.substring(0, 25) : '' // maximum allowed length
  }
}

export function setClientId(value) {
  return (dispatch, getState) => {
    dispatch({ type: NEW_RESERVATION_SET_CLIENT_ID,
      value
    })
    getState().newReservation.garage && dispatch(downloadGarage(getState().newReservation.garage.id))
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

    const state = getState().newReservation
    const availableClientsPromise = clientsPromise(state.user && state.user.id, state.garage && state.garage.id)
    availableClientsPromise.then(value => {
      value.reservable_clients.unshift({ name: t([ 'newReservation', 'selectClient' ]), id: undefined })
      state.user && dispatch(setUser({ ...state.user, availableClients: value.reservable_clients }))
    }).catch(error => {
      throw (error)
    })
  }
}

export function removeDiacritics() {
  return (dispatch, getState) => {
    const state = getState().newReservation
    dispatch(setTemplateText(state.templateText.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))
  }
}

export function setFromDate(value) {
  return (dispatch, getState) => {
    const from = moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT)
    const fromDate = moment(value, MOMENT_DATE_FORMAT)
    const toValue = null
    from.set('year', fromDate.get('year'))
    from.set('month', fromDate.get('month'))
    from.set('date', fromDate.get('date'))
    dispatch({ type:  NEW_RESERVATION_SET_FROM,
      value: from.format(MOMENT_DATETIME_FORMAT),
      to:    toValue
    })
    // dispatch(formatFrom())
  }
}

export function setFromTime(value) {
  return (dispatch, getState) => {
    const from = moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT)
    const fromTime = moment(value, MOMENT_TIME_FORMAT)
    const toValue = null
    from.set('hour', fromTime.get('hour'))
    from.set('minute', fromTime.get('minute'))
    dispatch({ type:  NEW_RESERVATION_SET_FROM,
      value: from.format(MOMENT_DATETIME_FORMAT),
      to:    toValue
    })
    // dispatch(formatFrom())
  }
}

export function formatFrom() {
  return (dispatch, getState) => {
    const fromValue = moment(roundTime(getState().newReservation.from), MOMENT_DATETIME_FORMAT)
    let toValue = null


    if (moment(getState().newReservation.to, MOMENT_DATETIME_FORMAT).isValid() &&
        moment(getState().newReservation.to, MOMENT_DATETIME_FORMAT).diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      toValue = fromValue.clone().add(MIN_RESERVATION_DURATION, 'minutes').format(MOMENT_DATETIME_FORMAT)
    }

    dispatch({ type:  NEW_RESERVATION_SET_FROM,
      value: fromValue.format(MOMENT_DATETIME_FORMAT),
      to:    toValue
    })

    moment(toValue, MOMENT_DATETIME_FORMAT).diff(fromValue, 'months') >= 1 && dispatch(setUseRecurring(false))
    getState().newReservation.garage && dispatch(downloadGarage(getState().newReservation.garage.id))
    dispatch(setPrice())
  }
}

export function setToDate(value) {
  return (dispatch, getState) => {
    const to = moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT)
    const toDate = moment(value, MOMENT_DATE_FORMAT)
    const fromValue = null
    to.set('year', toDate.get('year'))
    to.set('month', toDate.get('month'))
    to.set('date', toDate.get('date'))
    dispatch({ type:  NEW_RESERVATION_SET_TO,
      value:   to.format(MOMENT_DATETIME_FORMAT),
      from:    fromValue
    })
    // dispatch(formatTo())
  }
}

export function setToTime(value) {
  return (dispatch, getState) => {
    const to = moment(getState().newReservation.to, MOMENT_DATETIME_FORMAT)
    const toTime = moment(value, MOMENT_TIME_FORMAT)
    const fromValue = null
    to.set('hour', toTime.get('hour'))
    to.set('minute', toTime.get('minute'))
    dispatch({ type:  NEW_RESERVATION_SET_TO,
      value: to.format(MOMENT_DATETIME_FORMAT),
      from:  fromValue
    })
    // dispatch(formatTo())
  }
}

export function formatTo() {
  return (dispatch, getState) => {
    let toValue = moment(roundTime(getState().newReservation.to), MOMENT_DATETIME_FORMAT)
    const fromValue = moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT)

    if (toValue.diff(fromValue, 'minutes') < MIN_RESERVATION_DURATION) {
      toValue = fromValue.add(MIN_RESERVATION_DURATION, 'minutes')
    }

    dispatch({ type:  NEW_RESERVATION_SET_TO,
      value: toValue.format(MOMENT_DATETIME_FORMAT)
    })

    toValue.diff(fromValue, 'months') >= 1 && dispatch(setUseRecurring(false))
    getState().newReservation.garage && dispatch(downloadGarage(getState().newReservation.garage.id))
    dispatch(setPrice())
  }
}


export function setPlace(place) {
  return dispatch => {
    dispatch({ type:  NEW_RESERVATION_SET_PLACE_ID,
      value: place ? place.id : undefined
    })

    dispatch(setPrice())
  }
}

export function setPrice() {
  return (dispatch, getState) => {
    const state = getState().newReservation
    const from = moment(state.from, MOMENT_DATETIME_FORMAT)
    const to = moment(state.to, MOMENT_DATETIME_FORMAT)
    let selectedPlace = null
    if (state.place_id === undefined && state.garage && state.garage.flexiplace) {
      const freePlaces = state.garage.floors.reduce((acc, floor) => [ ...acc, ...floor.places ], [])
      selectedPlace = freePlaces.length && freePlaces[0]
    } else {
      selectedPlace = state.garage && state.garage.floors.reduce((acc, floor) => {
        return floor.places.reduce((acc, place) => {
          return place.id === state.place_id ? place : acc
        }, acc)
      }, undefined)
    }


    dispatch({ type:  NEW_RESERVATION_SET_PRICE,
      value: selectedPlace && selectedPlace.pricing ? `${calculatePrice(selectedPlace.pricing, from, to, state.garage.dic ? state.garage.vat : 0)} ${selectedPlace.pricing.currency.symbol}` : undefined
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


export function setInitialStore(id) {
  return (dispatch, getState) => {
    dispatch(setLoading(true))
    dispatch(pageBaseActions.setCustomModal(<div>{t([ 'newReservation', 'loading' ])}</div>))

    const availableUsersPromise = new Promise((resolve, reject) => {
      dispatch(setLoading(true))
      const onSuccess = response => {
        // dispatch(setLoading(false))
        if (response.data !== undefined) {
          resolve(response.data)
        } else {
          reject('Response has no data - available users')
        }
      }

      request(onSuccess, GET_AVAILABLE_USERS)
    })

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
      const users = values[0].reservable_users

      const currentUser = getState().pageBase.current_user
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

      dispatch(setAvailableUsers(users))
      dispatch(setLoading(false))

      if (values[1] !== undefined) { // if reservation edit set details
        values[1].reservation.ongoing = moment(values[1].reservation.begins_at).isBefore(moment()) // editing ongoing reservation
        dispatch(setNote(values[1].reservation.note))
        dispatch(setReservation(values[1].reservation))
        dispatch(downloadUser(values[1].reservation.user_id, undefined, hideLoading))
        dispatch(setClientId(values[1].reservation.client_id))
        values[1].reservation.car.temporary ? dispatch(setCarLicencePlate(values[1].reservation.car.licence_plate)) : dispatch(setCarId(values[1].reservation.car.id))
        dispatch(setFrom(moment(values[1].reservation.begins_at).format(MOMENT_DATETIME_FORMAT)))
        dispatch(setTo(moment(values[1].reservation.ends_at).format(MOMENT_DATETIME_FORMAT)))
        dispatch(setPlace(values[1].reservation.place))
      } else {
        dispatch(setReservation(undefined))
        dispatch(setFrom(moment().format(MOMENT_DATETIME_FORMAT)))
        dispatch(setTo(moment(getState().newReservation.from, MOMENT_DATETIME_FORMAT).add(MIN_RESERVATION_DURATION, 'minutes').format(MOMENT_DATETIME_FORMAT)))
        dispatch(formatFrom())
        dispatch(formatTo())
        if (users.length === 1) {
          dispatch(downloadUser(users[0].id, undefined, hideLoading))
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

export function downloadUser(id, rights) {
  return (dispatch, getState) => {
    const state = getState().newReservation
    dispatch(setLoading(true))
    dispatch(setGarage(undefined)) // have to reset values set from previous user
    dispatch(setClientId(undefined))
    dispatch(setCarId(undefined))

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

    const availableClientsPromise = clientsPromise(id, state.garage && state.garage.id)

    Promise.all([ userPromise, availableGaragesPromise, availableClientsPromise ]).then(values => {
      values[2].reservable_clients.unshift({ name: t([ 'newReservation', 'selectClient' ]), id: undefined })

      dispatch(setUser({ ...(values[0].user ? values[0].user : { id }),
        availableGarages: values[1].reservable_garages,
        availableClients: values[2].reservable_clients,
        rights // Client user rights
      }))
      let hideLoadingCalled = false

      if (values[0].user) {
        dispatch(setHostName(values[0].user.full_name, true))
        dispatch(setHostPhone(values[0].user.phone, true))
        dispatch(setHostEmail(values[0].user.email, true))
        dispatch(setLanguage(values[0].user.language))
      }

      if (getState().newReservation.reservation) { // download garage
        dispatch(downloadGarage(getState().newReservation.reservation.place.floor.garage.id))
        hideLoadingCalled = true
      }

      // if (values[1].reservable_garages.length === 1) { // if only one garage, download the garage
      //   dispatch(downloadGarage(values[1].reservable_garages[0].id))
      //   hideLoadingCalled = true
      // }

      if (values[0].user && values[0].user.reservable_cars.length === 1) { // if only one car available
        dispatch(setCarId(values[0].user.reservable_cars[0].id))
        if (!hideLoadingCalled) {
          hideLoading(dispatch)
          hideLoadingCalled = true
        }
      }
      if (!hideLoadingCalled) {
        hideLoading(dispatch)
      }
    }).catch(error => {
      hideLoading(dispatch)
      throw (error)
    })
  }
}

function clientsPromise(user_id, garage_id) {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      if (response.data !== undefined) {
        resolve(response.data)
      } else {
        reject('Response has no data - available users')
      }
    }

    request(onSuccess, GET_AVAILABLE_CLIENTS, { user_id, garage_id })
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
      const setFreeIntervalSuccess = response => {
        if (response.data !== undefined) {
          dispatch(setFreeInterval(response.data.garage.greatest_free_interval))
        }
      }

      // if full download,then full garage, if light download, then garage from state with updated free places
      const garage = value.garage.name ? value.garage : {
        ...state.garage,
        floors: state.garage.floors.map(floor => ({
          ...floor,
          free_places: value.garage.floors.findById(floor.id).free_places
        })),
        greatest_free_interval: value.garage.greatest_free_interval
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
                  <b>{t([ 'newPricing', 'weekendPrice' ])}:</b> {pricing.weekend_price} {symbol}
                </span>
              </div>}
            </div>)
          }

          return place
        })
      })

      const noFreePlaces = garage.floors.find(floor => floor.free_places.length !== 0) === undefined
      if (noFreePlaces) {
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
      hideLoading(dispatch)
    })
  }
}

export function autoSelectPlace() {
  return (dispatch, getState) => {
    const state = getState().newReservation
    if (state.garage.flexiplace) {
      dispatch(setPlace(undefined))
    } else if (!(state.place_id && state.garage.floors.find(floor => {
      return floor.places.find(place => place.available && place.id === state.place_id) !== undefined
    }) !== undefined)) { // if place not selected or selected place not found in this garage
      const selectedPlace = state.garage.floors.reduce((highestPriorityPlace, floor) => {
        return floor.places.reduce((highestPriorityPlace, place) => {
          if (place.available && (highestPriorityPlace === undefined || highestPriorityPlace.priority < place.priority)) {
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

    const onSuccess = response => {
      if (response.data.create_reservation && response.data.create_reservation.payment_url) {
        dispatch(pageBaseActions.setCustomModal(<div>{t([ 'newReservation', 'redirecting' ])}</div>))
        window.location.replace(response.data.create_reservation.payment_url)
      } else {
        dispatch(pageBaseActions.setCustomModal(undefined))
        nav.to(`/reservations/find/${(response.data.update_reservation || response.data.create_reservation).id}`)
        dispatch(clearForm())
      }
    }

    dispatch(pageBaseActions.setCustomModal(<div>{t([ 'newReservation', id ? 'updatingReservation' : 'creatingReservation' ])}</div>))

    const createTheReservation = user_id => {
      request(onSuccess
             , id ? UPDATE_RESERVATION : CREATE_RESERVATION
             , { reservation: {
               user_id:                  user_id,
               note:                     state.note ? state.note : undefined,
               place_id:                 state.place_id,
               garage_id:                state.garage.id,
               client_id:                state.client_id,
               paid_by_host:             ongoing ? undefined : state.client_id && state.paidByHost,
               car_id:                   state.car_id,
               licence_plate:            state.carLicencePlate === '' ? undefined : state.carLicencePlate,
               url:                      ongoing ? undefined : window.location.href.split('?')[0],
               begins_at:                timeToUTC(state.from),
               ends_at:                  timeToUTC(state.to),
               recurring_rule:           state.useRecurring ? JSON.stringify(state.recurringRule) : undefined,
               recurring_reservation_id: state.recurring_reservation_id,
               send_sms:                 state.sendSMS,
               sms_text:                 state.templateText,
               payment_method:           ongoing || (state.client_id && !state.paidByHost) ? undefined : state.paymentMethod
             },
               id
             }
             , 'reservationMutation'
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
              createTheReservation(data.user_by_email.id)
            }
          } else { // user is current user
            createTheReservation()
          }
        })
      } else { // create reservation as normal
        createTheReservation(state.user.id)
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

export function paymentUnsucessfull() {
  return dispatch => {
    dispatch(pageBaseActions.setError(t([ 'newReservation', 'paymentUnsucessfull' ])))
    nav.to('/reservations')
  }
}

export function paymentSucessfull() {
  return (dispatch, getState) => {
    nav.to('/reservations')
    dispatch(pageBaseActions.setCustomModal(undefined))
    dispatch(clearForm())
  }
}

// export function payReservation(token) {
//   return (dispatch, getState) => {
//     const onSuccess = response => {
//       dispatch(paymentSucessfull())
//     }
//
//     dispatch(pageBaseActions.setCustomModal(<div>{t([ 'newReservation', 'payingReservation' ])}</div>))
//     request(onSuccess
//            , PAY_RESREVATION
//            , { token }
//            )
//   }
// }

import { batchActions } from 'redux-batched-actions'

import request from '../helpers/request'
import requestPromise from '../helpers/requestPromise'

import { UPDATE_CURRENT_USER } from '../queries/pageBase.queries.js'
import {
  GET_CURRENT_USER, GET_CARS, DESTROY_CAR, GENERATE_CALENDAR_HASH
} from '../queries/profile.queries'
import { setCustomModal, fetchCurrentUser } from './pageBase.actions'
import { resetPassword }  from './resetPassword.actions'
import actionFactory      from '../helpers/actionFactory'


export const PROFILE_EDIT_USER_SET_NAME = 'PROFILE_EDIT_USER_SET_NAME'
export const PROFILE_EDIT_USER_SET_PHONE = 'PROFILE_EDIT_USER_SET_PHONE'
export const PROFILE_SET_CARS = 'PROFILE_SET_CARS'
export const PROFILE_TOGGLE_HIGHLIGHT = 'PROFILE_TOGGLE_HIGHLIGHT'
export const PROFILE_SET_GARAGES = 'PROFILE_SET_GARAGES'
export const PROFILE_SET_CLIENTS = 'PROFILE_SET_CLIENTS'
export const PROFILE_SET_CALENDAR_HASH = 'PROFILE_SET_CALENDAR_HASH'

const patternInputActionFactory = type => (value, valid) => ({ type, value: { value, valid } })

export const setName = patternInputActionFactory(PROFILE_EDIT_USER_SET_NAME)
export const setPhone = patternInputActionFactory(PROFILE_EDIT_USER_SET_PHONE)

export const setCars = actionFactory(PROFILE_SET_CARS)
export const setGarages = actionFactory(PROFILE_SET_GARAGES)
export const setClients = actionFactory(PROFILE_SET_CLIENTS)
export const toggleHighlight = actionFactory(PROFILE_TOGGLE_HIGHLIGHT)
const setCalendarHash = actionFactory(PROFILE_SET_CALENDAR_HASH)

function formatCars(userCars) {
  return userCars.map(userCar => ({ ...userCar.car, admin: userCar.admin }))
}

function fromatGarages(userGarages) {
  return userGarages.map(userGarage => {
    const { garage, ...userGarWithoutGar } = userGarage
    return { ...garage, ...userGarWithoutGar }
  })
}

function formatClients(clientUsers) {
  return clientUsers.map(clientUser => {
    const { client, ...clientUserWithoutClient } = clientUser
    return { ...client, ...clientUserWithoutClient }
  })
}

export function initCars(id) {
  return dispatch => {
    const onCarsSuccess = response => {
      dispatch(setCars(formatCars(response.data.user_cars)))
    }

    request(onCarsSuccess, GET_CARS, { user_id: id })
  }
}

export function initUser() {
  return dispatch => {
    const onSuccess = response => {
      dispatch(batchActions([
        setCars(formatCars(response.data.current_user.user_cars)),
        setName(response.data.current_user.full_name, true),
        setPhone(response.data.current_user.phone, true),
        setGarages(fromatGarages(response.data.current_user.user_garages)),
        setClients(formatClients(response.data.current_user.client_users)),
        setCalendarHash(response.data.current_user.calendar_hash)
      ], 'PROFILE_INIT_USER'))
    }

    request(onSuccess, GET_CURRENT_USER)
  }
}

export function submitUser() {
  return (dispatch, getState) => {
    const state = getState().profile
    const base = getState().pageBase

    const onSuccess = () => dispatch(fetchCurrentUser())

    request(onSuccess,
      UPDATE_CURRENT_USER,
      {
        id:   base.current_user.id,
        user: {
          full_name: state.name.value,
          phone:     state.phone.value.replace(/\s/g, '')
        }
      })
  }
}

export function toggleShowPublicGarages() {
  return (dispatch, getState) => {
    const currentUser = getState().pageBase.current_user
    const onSuccess = () => dispatch(fetchCurrentUser())

    request(onSuccess,
      UPDATE_CURRENT_USER,
      {
        id:   currentUser.id,
        user: {
          hide_public_garages: !currentUser.hide_public_garages
        }
      })
  }
}

export function changeHints() {
  return (dispatch, getState) => {
    const onSuccess = () => dispatch(fetchCurrentUser())

    const current_user = getState().pageBase.current_user
    request(onSuccess, UPDATE_CURRENT_USER, { user: { hint: !current_user.hint }, id: current_user.id })
  }
}

export function destroyCar(id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(initCars())
    }
    request(onSuccess, DESTROY_CAR, { id: parseInt(id) })
  }
}

export function changePassword(modal) {
  return (dispatch, getState) => {
    dispatch(resetPassword(getState().pageBase.current_user.email))
    dispatch(setCustomModal(modal))
  }
}

export function generateCalendarHash() {
  return async dispatch => {
    const { calendar_hash: { calendar_hash: calendarHash } } = await requestPromise(GENERATE_CALENDAR_HASH)
    dispatch(setCalendarHash(calendarHash))
  }
}

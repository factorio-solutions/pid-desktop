import { request }  from '../helpers/request'
import * as nav     from '../helpers/navigation'

import { GET_CURRENT_USER, UPDATE_CURRENT_USER } from '../queries/pageBase.queries.js'
import { GET_CARS, DESTROY_CAR } from '../queries/profile.queries'
import { setCurrentUser, setCustomModal, fetchCurrentUser } from './pageBase.actions'
import { resetPassword }  from './resetPassword.actions'
import actionFactory      from '../helpers/actionFactory'


export const PROFILE_EDIT_USER_SET_NAME = 'PROFILE_EDIT_USER_SET_NAME'
export const PROFILE_EDIT_USER_SET_PHONE = 'PROFILE_EDIT_USER_SET_PHONE'
export const PROFILE_SET_CARS = 'PROFILE_SET_CARS'
export const PROFILE_TOGGLE_HIGHLIGHT = 'PROFILE_TOGGLE_HIGHLIGHT'
export const PROFILE_SET_RELATED_GARAGES = 'PROFILE_SET_RELATED_GARAGES'

const patternInputActionFactory = type => (value, valid) => ({ type, value: { value, valid } })

export const setName = patternInputActionFactory(PROFILE_EDIT_USER_SET_NAME)
export const setPhone = patternInputActionFactory(PROFILE_EDIT_USER_SET_PHONE)

export const setCars = actionFactory(PROFILE_SET_CARS)
export const setRelatedGarages = actionFactory(PROFILE_SET_RELATED_GARAGES)
export const toggleHighlight = actionFactory(PROFILE_TOGGLE_HIGHLIGHT)

export function initCars(id) {
  return dispatch => {
    const onCarsSuccess = response => {
      dispatch(setCars(response.data.user_cars.map(userCar => { return { ...userCar.car, admin: userCar.admin } })))
    }

    request(onCarsSuccess, GET_CARS, { user_id: id })
  }
}

export function initUser() {
  return dispatch => {
    const onSuccess = response => {
      dispatch(initCars(response.data.current_user.id))
      dispatch(setName(response.data.current_user.full_name, true))
      dispatch(setPhone(response.data.current_user.phone, true))
      dispatch(setRelatedGarages(response.data.current_user.all_related_garages))
    }

    request(onSuccess, GET_CURRENT_USER)
  }
}

export function submitUser() {
  return (dispatch, getState) => {
    const state = getState().profile
    const base = getState().pageBase

    const onSuccess = response => {
      dispatch(setCurrentUser(response.data.update_user))
      nav.to(`/${base.garage}/dashboard`)
    }

    request(onSuccess,
      UPDATE_CURRENT_USER,
      { id:   base.current_user.id,
        user: {
          full_name: state.name.value,
          phone:     state.phone.value.replace(/\s/g, '')
        }
      }
    )
  }
}

export function toggleShowPublicGarages() {
  return (dispatch, getState) => {
    const currentUser = getState().pageBase.current_user
    const onSuccess = () => dispatch(fetchCurrentUser())

    request(onSuccess,
      UPDATE_CURRENT_USER,
      { id:   currentUser.id,
        user: {
          hide_public_garages: !currentUser.hide_public_garages
        }
      }
    )
  }
}

export function changeHints() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setCurrentUser(response.data.update_user))
    }

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

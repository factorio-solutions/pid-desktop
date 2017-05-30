import { request }  from '../helpers/request'
import * as nav     from '../helpers/navigation'

import { GET_CURRENT_USER, UPDATE_CURRENT_USER } from '../queries/pageBase.queries.js'
import { GET_CARS, DESTROY_CAR } from '../queries/profile.queries'
import { setCurrentUser, setCustomModal } from './pageBase.actions'
import { resetPassword }  from './resetPassword.actions'


export const PROFILE_EDIT_USER_SET_NAME =  "PROFILE_EDIT_USER_SET_NAME"
export const PROFILE_EDIT_USER_SET_PHONE = "PROFILE_EDIT_USER_SET_PHONE"
export const PROFILE_SET_CARS = 'PROFILE_SET_CARS'


export function setName (value,valid) {
  return { type: PROFILE_EDIT_USER_SET_NAME
         , value: {value, valid}
         }
}

export function setPhone (value,valid) {
  return { type: PROFILE_EDIT_USER_SET_PHONE
         , value: {value, valid}
         }
}
export function setCars (value) {
  return { type: PROFILE_SET_CARS
         , value
         }
}

export function initCars(){
  return (dispatch, getState) => {
    const onCarsSuccess = (response) => {
      dispatch(setCars(response.data.user_cars.map((userCar) => { return { ...userCar.car, admin: userCar.admin } })))
    }

    request(onCarsSuccess, GET_CARS)
  }
}

export function initUser () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setName(response.data.current_user.full_name, true))
      // dispatch(setEmail(response.data.current_user.email, true))
      dispatch(setPhone(response.data.current_user.phone, true))
    }

    request(onSuccess, GET_CURRENT_USER)
  }
}

export function submitUser() {
  return (dispatch, getState) => {
    const state = getState().profile
    const base = getState().pageBase

    const onSuccess = (response) => {
      dispatch(setCurrentUser(response.data.update_user))
      nav.to(`/${base.garage}/dashboard`)
    }

    request(onSuccess
           , UPDATE_CURRENT_USER
           , { id: base.current_user.id
             , user: { full_name: state.name.value
                     , phone:     state.phone.value
                     }
             }
           )
  }
}

export function changeHints() {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setCurrentUser( response.data.update_user ) )
    }

    const current_user = getState().pageBase.current_user
    request(onSuccess, UPDATE_CURRENT_USER, {"user":{"hint": !current_user.hint},"id": current_user.id})
  }
}

export function destroyCar(id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(initCars())
    }
    request(onSuccess, DESTROY_CAR, {id: parseInt(id)})
  }
}

export function changePassword(modal) {
  return (dispatch, getState) => {
    dispatch(resetPassword(getState().pageBase.current_user.email))
    dispatch(setCustomModal(modal))
  }
}

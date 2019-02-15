import request   from '../helpers/request'
import { t }         from '../modules/localization/localization'
import { setError }  from './pageBase.actions'
import actionFactory from '../helpers/actionFactory'

import { GET_CARUSERS, UPDATE_CARUSERS, DESTROY_CARUSERS } from '../queries/carUsers.queries'

export const SET_CAR_USERS = 'SET_CAR_USERS'
export const SET_CAR_USER_CAR = 'SET_CAR_USER_CAR'
export const SET_CAR_PENDING_USERS = 'SET_CAR_PENDING_USERS'


export const setCarUsersUsers = actionFactory(SET_CAR_USERS)
export const setCarUsersPendingUsers = actionFactory(SET_CAR_PENDING_USERS)
export const setCarUsersCar = actionFactory(SET_CAR_USER_CAR)


export function initCarUsers(id) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setCarUsersUsers(response.data.user_cars.filter(carUser => !carUser.pending)))
      dispatch(setCarUsersCar({ ...response.data.user_cars[0].car, admin: response.data.user_cars.find(carUser => carUser.user.id === response.data.current_user.id).admin }))
      dispatch(setCarUsersPendingUsers(response.data.user_cars.filter(carUser => carUser.pending)))
    }
    request(onSuccess, GET_CARUSERS, { id: parseInt(id, 10) })
  }
}

export function destroyCarUser(carId, userId) {
  return dispatch => {
    const onSuccess = response => {
      if (response.data.destroy_user_car == null) {
        dispatch(setError(t([ 'inviteUser', 'noRights' ])))
      } else {
        dispatch(initCarUsers(response.data.destroy_user_car.car_id))
      }
    }
    request(onSuccess, DESTROY_CARUSERS, {
      user_id: userId,
      car_id:  parseInt(carId, 10)
    })
  }
}

export function setCarUserRelation(carId, userId, relation) {
  return dispatch => {
    const onSuccess = response => {
      if (response.data.update_user_car == null) {
        dispatch(setError(t([ 'inviteUser', 'noRights' ])))
      } else {
        dispatch(initCarUsers(response.data.update_user_car.car_id))
      }
    }
    request(onSuccess, UPDATE_CARUSERS, {
      user_car: relation,
      user_id:  userId,
      car_id:   parseInt(carId, 10)
    })
  }
}

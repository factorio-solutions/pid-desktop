import { request }  from '../helpers/request'
import {t}          from '../modules/localization/localization'
import { setError } from './pageBase.actions'

import { GET_CARUSERS, UPDATE_CARUSERS, DESTROY_CARUSERS } from '../queries/carUsers.queries'
import { toCars } from './pageBase.actions'

export const SET_CAR_USERS         = 'SET_CAR_USERS'
export const SET_CAR_USER_CAR      = 'SET_CAR_USER_CAR'
export const SET_CAR_PENDING_USERS = 'SET_CAR_PENDING_USERS'


export function setCarUsersUsers (users){
  return  { type: SET_CAR_USERS
          , value: users
          }
}

export function setCarUsersCar (car){
  return  { type: SET_CAR_USER_CAR
          , value: car
          }
}

export function setCarUsersPendingUsers (users){
  return  { type: SET_CAR_PENDING_USERS
          , value: users
          }
}


export function initCarUsers (id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setCarUsersUsers(response.data.user_cars.filter((carUser)=>{return carUser.pending == false}) ) )
      dispatch( setCarUsersCar({ ...response.data.user_cars[0].car, admin: response.data.user_cars.find((carUser)=>{return carUser.user.id == response.data.current_user.id}).admin}) )
      dispatch( setCarUsersPendingUsers(response.data.user_cars.filter((carUser)=>{return carUser.pending == true})) )

      dispatch(toCars())
    }
    request(onSuccess, GET_CARUSERS, {id: parseInt(id)})
  }
}

export function destroyCarUser(car_id, user_id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.destroy_user_car == null){
        dispatch(setError( t(['inviteUser', 'noRights']) ))
      } else {
        dispatch( initCarUsers(response.data.destroy_user_car.car_id) )
      }
    }
    request(onSuccess, DESTROY_CARUSERS, {
          user_id: user_id,
          car_id:  parseInt(car_id)
        })
  }
}

export function setCarUserRelation (car_id, user_id, relation){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.update_user_car == null){
        dispatch(setError( t(['inviteUser', 'noRights']) ))
      } else {
        dispatch( initCarUsers(response.data.update_user_car.car_id) )
      }
    }
    request(onSuccess, UPDATE_CARUSERS, {
          user_car: relation,
          user_id:  user_id,
          car_id:   parseInt(car_id)
        })
  }
}

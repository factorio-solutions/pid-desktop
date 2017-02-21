import { request }  from '../helpers/request'
import {t}          from '../modules/localization/localization'
import { setError } from './pageBase.actions'

import { GET_GARAGEUSERS, UPDATE_GARAGEUSERS, DESTROY_GARAGEUSERS } from '../queries/garageUsers.queries'
import { toGarages } from './pageBase.actions'

export const SET_GARAGE_USERS         = 'SET_GARAGE_USERS'
export const SET_GARAGE_PENDING_USERS = 'SET_GARAGE_PENDING_USERS'
export const SET_GARAGE_USER_GARAGE   = 'SET_GARAGE_USER_GARAGE'

export function setGarageUsersUsers (users){
  return  { type: SET_GARAGE_USERS
          , value: users
          }
}

export function setGarageUsersPendingUsers (users){
  return  { type: SET_GARAGE_PENDING_USERS
          , value: users
          }
}

export function setGarageUsersGarage (garage){
  return  { type: SET_GARAGE_USER_GARAGE
          , value: garage
          }
}


export function initGarageUsers (garage_id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setGarageUsersUsers( response.data.user_garages.filter((garageUser)=>{return garageUser.pending == false}) ) )
      dispatch( setGarageUsersPendingUsers(response.data.user_garages.filter((garageUser)=>{return garageUser.pending == true})) )
      dispatch( setGarageUsersGarage(response.data.garage) )

      dispatch( toGarages() )
    }
    request(onSuccess, GET_GARAGEUSERS, {id: +garage_id })
  }
}

export function destroyGarageUser(garage_id, user_id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.destroy_user_garage == null){
        dispatch(setError( t(['garageUsers', 'noRights']) ))
      } else {
        dispatch( initGarageUsers(response.data.destroy_user_garage.garage_id) )
      }
    }
    request(onSuccess, DESTROY_GARAGEUSERS, {
          "user_id": user_id,
          "garage_id": +garage_id
        })
  }
}

export function setGarageUserRelation (garage_id, user_id, relation){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.update_user_garage == null){
        dispatch(setError( t(['garageUsers', 'noRights']) ))
      } else {
        dispatch( initGarageUsers(response.data.update_user_garage.garage_id) )
      }
    }
    request(onSuccess, UPDATE_GARAGEUSERS, {
          "user_garage": relation,
          "user_id": user_id,
          "garage_id": +garage_id
        })
  }
}

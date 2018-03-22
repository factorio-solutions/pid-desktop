import { request }   from '../helpers/request'
import actionFactory from '../helpers/actionFactory'
import { t }         from '../modules/localization/localization'

import {
  GET_GARAGEUSERS,
  UPDATE_GARAGEUSERS,
  DESTROY_GARAGEUSERS
} from '../queries/garageUsers.queries'
import { fetchGarages, setError } from './pageBase.actions'

export const SET_GARAGE_USERS = 'SET_GARAGE_USERS'
export const SET_GARAGE_PENDING_USERS = 'SET_GARAGE_PENDING_USERS'
export const SET_GARAGE_USER_GARAGE = 'SET_GARAGE_USER_GARAGE'

export const setGarageUsersUsers = actionFactory(SET_GARAGE_USERS)
export const setGarageUsersPendingUsers = actionFactory(SET_GARAGE_PENDING_USERS)
export const setGarageUsersGarage = actionFactory(SET_GARAGE_USER_GARAGE)


export function initGarageUsers(garageId) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(setGarageUsersUsers(response.data.user_garages.filter(garageUser => { return garageUser.pending === false })))
      dispatch(setGarageUsersPendingUsers(response.data.user_garages.filter(garageUser => { return garageUser.pending === true })))
      dispatch(setGarageUsersGarage(response.data.garage))
    }
    request(onSuccess, GET_GARAGEUSERS, { id: +garageId })
  }
}

export function destroyGarageUser(garageId, userId) {
  return dispatch => {
    const onSuccess = response => {
      if (response.data.destroy_user_garage == null) {
        dispatch(setError(t([ 'garageUsers', 'noRights' ])))
      } else {
        dispatch(initGarageUsers(response.data.destroy_user_garage.garage_id))
        dispatch(fetchGarages())
      }
    }
    request(onSuccess, DESTROY_GARAGEUSERS, {
      user_id:   userId,
      garage_id: +garageId
    })
  }
}

export function setGarageUserRelation(garageId, userId, relation) {
  return dispatch => {
    const onSuccess = response => {
      if (response.data.update_user_garage == null) {
        dispatch(setError(t([ 'garageUsers', 'noRights' ])))
      } else {
        dispatch(initGarageUsers(response.data.update_user_garage.garage_id))
        dispatch(fetchGarages())
      }
    }
    request(onSuccess, UPDATE_GARAGEUSERS, {
      user_garage: relation,
      user_id:     userId,
      garage_id:   +garageId
    })
  }
}

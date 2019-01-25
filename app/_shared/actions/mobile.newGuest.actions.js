import actionFactory from '../helpers/actionFactory'
import { setUserId } from './mobile.newReservation.actions'

export const NEW_GUEST_SET_NAME = 'NEW_GUEST_SET_NAME'
export const NEW_GUEST_SET_EMAIL = 'NEW_GUEST_SET_EMAIL'
export const NEW_GUEST_SET_PHONE = 'NEW_GUEST_SET_PHONE'
export const NEW_GUEST_CLEAR_FORM = 'MOBILE_NEW_RESERVATION_CLEAR_FORM'
export const NEW_GUEST_SET_HISTORY = 'NEW_GUEST_SET_HISTORY'
export const NEW_GUEST_UNDO = 'NEW_GUEST_UNDO'


export const setName = actionFactory(NEW_GUEST_SET_NAME)
export const setEmail = actionFactory(NEW_GUEST_SET_EMAIL)
export const setPhone = actionFactory(NEW_GUEST_SET_PHONE)
export const clearForm = actionFactory(NEW_GUEST_CLEAR_FORM)
export const saveHistory = actionFactory(NEW_GUEST_SET_HISTORY)
export const undo = actionFactory(NEW_GUEST_UNDO)


export function submitGuest() {
  return dispatch => dispatch(setUserId(-1))
}

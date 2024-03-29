import request from '../helpers/request'
import * as nav    from '../helpers/navigation'
import {t}         from '../modules/localization/localization'

import { RESET_PASSWORD } from '../queries/resetPassword.queries'


export const RESET_PASSWORD_EMAIL = 'LOGIN_SET_EMAIL'
export const RESET_PASSWORD_MODAL = 'RESET_PASSWORD_MODAL'


export function setEmail (value, valid){
  return  { type: RESET_PASSWORD_EMAIL
          , value: {value, valid}
          }
}

export function setModal (value){
  return  { type: RESET_PASSWORD_MODAL
          , value
          }
}


export function dismissModal () {
    return (dispatch, getState) => {
      dispatch(setModal(undefined))
      nav.to('/')
    }
}

export function sendPasswordReset(){
  return (dispatch, getState) => {
    dispatch(resetPassword(getState().resetPassword.email.value))
  }
}

export function resetPassword(email, callback = () => {}) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setModal(t(['resetPassword', 'send'])))
      callback()
    }

    request(onSuccess, RESET_PASSWORD, {email})
  }
}

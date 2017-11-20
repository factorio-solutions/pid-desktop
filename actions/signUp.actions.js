import translate from 'counterpart'

import { t } from '../modules/localization/localization'
import { login } from './login.actions'


import { request } from '../helpers/request'
// import * as nav from '../helpers/navigation'
import { mobile } from '../../index'

import { CREATE_USER_QUERY } from '../queries/signUp.queries'

export const REGISTER_REQUEST = 'REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'REGISTER_FAILURE'
export const REGISTER_SET_NAME = 'REGISTER_SET_NAME'
export const REGISTER_SET_PHONE = 'REGISTER_SET_PHONE'
export const REGISTER_SET_EMAIL = 'LOGIN_SET_EMAIL' // listen to the same event
export const REGISTER_SET_PASSWORD = 'REGISTER_SET_PASSWORD'
export const REGISTER_SET_CONFIRMATION = 'REGISTER_SET_CONFIRMATION'
export const REGISTER_SET_RESET_TOKEN = 'REGISTER_SET_RESET_TOKEN'


export function setError(error) {
  return {
    type:  REGISTER_FAILURE,
    value: error
  }
}

export function setName(value, valid) {
  return {
    type:  REGISTER_SET_NAME,
    value: {
      value,
      valid
    }
  }
}

export function setPhone(value, valid) {
  return {
    type:  REGISTER_SET_PHONE,
    value: {
      value,
      valid
    }
  }
}

export function setEmail(value, valid) {
  return {
    type:  REGISTER_SET_EMAIL,
    value: {
      value,
      valid
    }
  }
}

export function setPassword(value, valid) {
  return {
    type:  REGISTER_SET_PASSWORD,
    value: {
      value,
      valid
    }
  }
}

export function setConfirmation(value, valid) {
  return {
    type:  REGISTER_SET_CONFIRMATION,
    value: {
      value,
      valid
    }
  }
}

export function setResetToken(token) {
  return {
    type:  REGISTER_SET_RESET_TOKEN,
    value: token
  }
}


export function dismissModal() {
  return dispatch => {
    dispatch(setError(undefined))
  }
}

export function init(params) {
  return dispatch => {
    params.full_name && dispatch(setName(params.full_name, true))
    params.phone && dispatch(setPhone(params.phone, true))
    params.email && dispatch(setEmail(params.email, true))
    params.reset_token && dispatch(setResetToken(params.reset_token))
  }
}

export function register(callback = () => {}) {
  return (dispatch, getState) => {
    const state = getState().signUp

    const auth0LoginSuccess = () => {
      dispatch({ type: REGISTER_SUCCESS })
      callback()
    }

    const apiCreateOnSuccess = response => {
      if (response.data.create_user == null) {
        dispatch({ type: REGISTER_SUCCESS })
        dispatch(setError(t([ 'signup_page', 'userNotCreated' ])))
      } else {
        dispatch(login(state.email.value, state.password.value, !mobile, auth0LoginSuccess))
      }
    }

    dispatch({ type: REGISTER_REQUEST })
    request(
      apiCreateOnSuccess,
      CREATE_USER_QUERY,
      {
        user: {
          email:       state.email.value,
          full_name:   state.name.value,
          phone:       state.phone.value,
          password:    state.password.value,
          reset_token: state.reset_token,
          language:    translate.getLocale()
        }
      }
    )
  }
}

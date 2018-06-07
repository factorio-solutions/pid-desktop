import { request }   from '../helpers/request'
import * as nav      from '../helpers/navigation'
import actionFactory from '../helpers/actionFactory'
import { mobile }    from '../../index'
import { version }   from '../../../package'

import { LOGIN_USER, LOGIN_VERIFICATION } from '../queries/login.queries.js'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGIN_SET_EMAIL = 'LOGIN_SET_EMAIL'
export const LOGIN_SET_PASSWORD = 'LOGIN_SET_PASSWORD'
export const LOGIN_SET_CODE = 'LOGIN_SET_CODE'
export const RESET_LOGIN_FORM = 'RESET_LOGIN_FORM'
export const LOGIN_SET_DEVICE_FINGERPRINT = 'LOGIN_SET_DEVICE_FINGERPRINT'


export const setError = actionFactory(LOGIN_FAILURE)
export const setDeviceFingerprint = actionFactory(LOGIN_SET_DEVICE_FINGERPRINT)
export const resetLoginForm = actionFactory(RESET_LOGIN_FORM)
export const resetStore = actionFactory('RESET')

export function setEmail(value, valid) {
  return { type:  LOGIN_SET_EMAIL,
    value: { value, valid }
  }
}

export function setPassword(value, valid) {
  return { type:  LOGIN_SET_PASSWORD,
    value: { value, valid }
  }
}

export function setCode(value, valid) {
  return { type:  LOGIN_SET_CODE,
    value: { value, valid }
  }
}


export function dismissModal() {
  return dispatch => {
    dispatch(setError(undefined))
  }
}


export function loginSuccess(result, redirect, callback) {
  return dispatch => {
    if ('id_token' in result) {
      localStorage.jwt = result.id_token
      localStorage.refresh_token = result.refresh_token
      dispatch({ type: LOGIN_SUCCESS })

      callback(result)
      dispatch(resetLoginForm())
      if (redirect) {
        const path = localStorage.redirect || '/dashboard'
        delete localStorage.redirect
        nav.to(path)
      }
    } else {
      dispatch(setError(result.error_description || 'no description'))
    }
  }
}

export function login(email, password, redirect = false, callback = () => {}) {
  return (dispatch, getState) => {
    const success = response => {
      const result = JSON.parse(response.data.login)
      if (result.error === 'mfa_required') { // MFA triggered
        dispatch({ type: LOGIN_SUCCESS })
        nav.to('/codeVerification')
      } else {
        dispatch(loginSuccess(result, redirect, callback))
      }
    }

    const onError = () => {
      dispatch(setError('No response'))
    }

    dispatch({ type: LOGIN_REQUEST })
    request(
      success,
      LOGIN_USER,
      { email,
        password,
        device_fingerprint: getState().login.deviceFingerprint,
        mobile_app_version: mobile ? version : null
      },
      null,
      onError
    )
  }
}

export function verifyCode(email, code, redirect = true, callback = () => {}) {
  return (dispatch, getState) => {
    const success = response => {
      const result = JSON.parse(response.data.login_verification)
      if (result.error) {
        dispatch(setError('Code invalid or expired. Please try again.'))
      } else {
        dispatch(loginSuccess(result, redirect, callback))
      }
    }

    const onError = () => {
      dispatch(setError('No response'))
    }

    dispatch({ type: LOGIN_REQUEST }) // show loading
    request(
      success,
      LOGIN_VERIFICATION,
      { email,
        code,
        device_fingerprint: getState().login.deviceFingerprint
      },
      null,
      onError
    )
  }
}

export function logout() {
  return dispatch => {
    dispatch(resetStore())
    delete localStorage.jwt
    // delete localStorage['refresh_token']
    nav.to('/')
  }
}

export function refreshLogin(callback, errorCallback) {
  return (dispatch, getState) => {
    const success = response => {
      const result = JSON.parse(response.data.login)
      if (result && result.id_token) {
        localStorage.jwt = result.id_token
        dispatch({ type: LOGIN_SUCCESS })
        callback && callback(result)
        dispatch(resetLoginForm())
      } else {
        localStorage.refresh_token && dispatch(logout())
        delete localStorage.refresh_token
        errorCallback && errorCallback()
      }
    }

    const currentUser = getState().mobileHeader.current_user
    const onError = () => console.log('Error while refreshing token')
    request(
      success,
      LOGIN_USER,
      { refresh_token:      localStorage.refresh_token,
        email:              currentUser ? currentUser.email : null,
        mobile_app_version: version
      },
      null,
      onError
    )
  }
}

import localforage from 'localforage'
import { request }    from '../helpers/request'
import requestPromise from '../helpers/requestPromise'
import * as nav       from '../helpers/navigation'
import actionFactory  from '../helpers/actionFactory'
import { mobile }     from '../../index'
import { version }    from '../../../package'

import RequestInProgressError from '../errors/requestInProgress.error'

import { LOGIN_USER, LOGIN_VERIFICATION } from '../queries/login.queries.js'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGIN_SET_EMAIL = 'LOGIN_SET_EMAIL'
export const LOGIN_SET_PASSWORD = 'LOGIN_SET_PASSWORD'
export const LOGIN_SET_CODE = 'LOGIN_SET_CODE'
export const RESET_LOGIN_FORM = 'RESET_LOGIN_FORM'
export const LOGIN_SET_DEVICE_FINGERPRINT = 'LOGIN_SET_DEVICE_FINGERPRINT'
export const LOGIN_PASSWORD_RESET_SUCCESSFUL = 'LOGIN_PASSWORD_RESET_SUCCESSFUL'
export const LOGIN_SHOW_PASSWORD_RESET_MODAL = 'LOGIN_SHOW_PASSWORD_RESET_MODAL'
export const LOGIN_SET_REFRESHING_LOGIN = 'LOGIN_SET_REFRESHING_LOGIN'

export const setError = actionFactory(LOGIN_FAILURE)
export const setDeviceFingerprint = actionFactory(LOGIN_SET_DEVICE_FINGERPRINT)
export const resetLoginForm = actionFactory(RESET_LOGIN_FORM)
export const resetStore = actionFactory('RESET')
export const setPasswordResetSuccessful = actionFactory(LOGIN_PASSWORD_RESET_SUCCESSFUL)
export const setShowPasswordResetModal = actionFactory(LOGIN_SHOW_PASSWORD_RESET_MODAL)
export const setRefreshingLogin = actionFactory(LOGIN_SET_REFRESHING_LOGIN)

export function setEmail(value, valid) {
  return {
    type:  LOGIN_SET_EMAIL,
    value: { value, valid }
  }
}

export function setPassword(value, valid) {
  return {
    type:  LOGIN_SET_PASSWORD,
    value: { value, valid }
  }
}

export function setCode(value, valid) {
  return {
    type:  LOGIN_SET_CODE,
    value: { value, valid }
  }
}


export function dismissModal() {
  return dispatch => {
    dispatch(setError(undefined))
    dispatch(setShowPasswordResetModal(false))
  }
}


export function loginSuccess(result, redirect, callback) {
  return async dispatch => {
    if ('id_token' in result) {
      localforage.setItem('jwt', result.id_token)
      localforage.setItem('refresh_token', result.refresh_token)
      dispatch({ type: LOGIN_SUCCESS })

      dispatch(resetLoginForm())
      callback(result)
      if (redirect) {
        const path = await localforage.getItem('redirect') || '/occupancy'
        localforage.removeItem('redirect')
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

    const onError = e => {
      dispatch(setError('No response'))
      console.log(e)
    }

    dispatch({ type: LOGIN_REQUEST })
    request(
      success,
      LOGIN_USER,
      {
        email,
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
      {
        email,
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
    localforage.removeItem('jwt')
    localforage.removeItem('refresh_token')
    nav.to('/')
  }
}

export function refreshLogin() {
  return async (dispatch, getState) => {
    const { refreshingLogin } = getState().login
    if (refreshingLogin) { throw new RequestInProgressError('refreshingInProgress') }
    dispatch(setRefreshingLogin(true))
    const { current_user: currentUser } = getState().mobileHeader
    const refreshToken = await localforage.getItem('refresh_token')
    console.log('Current user:', currentUser)
    console.log('refresh_token:', refreshToken)
    // if (!currentUser) { throw new Error('Current user is not set.') }
    if (!refreshToken) {
      throw new Error('refresh token is not set.')
    }

    try {
      const data = await requestPromise(
        LOGIN_USER,
        {
          refresh_token:      refreshToken,
          email:              currentUser && currentUser.email,
          mobile_app_version: version
        },
      )
      const result = JSON.parse(data.login)
      console.log('Data:', data)
      console.log('Result of refreshing:', result)
      if (result && result.id_token) {
        localforage.setItem('jwt', result.id_token)
        dispatch({ type: LOGIN_SUCCESS })
        dispatch(resetLoginForm())
      } else {
        await localforage.removeItem('refresh_token')
        console.log('Not successful refresh.')
        throw new Error('Cannot refresh.')
      }
    } finally {
      dispatch(setRefreshingLogin(false))
    }
  }
}

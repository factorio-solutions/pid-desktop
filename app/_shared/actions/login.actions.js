import { request }    from '../helpers/request'
import * as nav       from '../helpers/navigation'
import { LOGIN_USER, LOGIN_VERIFICATION } from '../queries/login.queries.js'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGIN_SET_EMAIL = 'LOGIN_SET_EMAIL'
export const LOGIN_SET_PASSWORD = 'LOGIN_SET_PASSWORD'
export const LOGIN_SET_CODE = 'LOGIN_SET_CODE'
export const RESET_LOGIN_FORM = 'RESET_LOGIN_FORM'
export const LOGIN_SET_DEVICE_FINGERPRINT = 'LOGIN_SET_DEVICE_FINGERPRINT'


function setError(error) {
  return { type:  LOGIN_FAILURE,
    value: error
  }
}

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

export function setDeviceFingerprint(value) {
  return { type: LOGIN_SET_DEVICE_FINGERPRINT,
    value
  }
}

function resetLoginForm() {
  return { type: RESET_LOGIN_FORM }
}


export function dismissModal() {
  return (dispatch, getState) => {
    dispatch(setError(undefined))
  }
}

export function resetStore() {
  return { type: 'RESET' }
}

export function loginSuccess(result, redirect, callback) {
  return (dispatch, getState) => {
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
    request(success
           , LOGIN_USER
           , { email,
             password,
             device_fingerprint: getState().login.deviceFingerprint
           }
           , null
           , onError
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
    request(success
           , LOGIN_VERIFICATION
           , { email,
             code,
             device_fingerprint: getState().login.deviceFingerprint
           }
           , null
           , onError
           )
  }
}

export function refresh_login(refresh_token, callback) {
  return (dispatch, getState) => {
    const success = response => {
      const result = JSON.parse(response.data.login)
      if ('id_token' in result) {
        localStorage.jwt = result.id_token
        dispatch({ type: LOGIN_SUCCESS })
        callback(result)
        dispatch(resetLoginForm())
      } else {
        delete localStorage.refresh_token
      }
    }

    const onError = () => {
      console.log('Error while refreshing token')
    }

    request(success, LOGIN_USER, { refresh_token: localStorage.refresh_token }, null, onError)
  }
}

export function logout() {
  return (dispatch, getState) => {
    dispatch(resetStore())
    delete localStorage.jwt
    // delete localStorage['refresh_token']
    nav.to('/')
  }
}

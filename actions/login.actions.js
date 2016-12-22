import _ from 'lodash'

import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'
import { _auth0, CONNECTION }    from  '../helpers/auth0'

export const LOGIN_REQUEST      = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS      = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE      = 'LOGIN_FAILURE'
export const LOGIN_SET_EMAIL    = 'LOGIN_SET_EMAIL'
export const LOGIN_SET_PASSWORD = 'LOGIN_SET_PASSWORD'
export const RESET_LOGIN_FORM   = 'RESET_LOGIN_FORM'


function setError (error){
  return  { type: LOGIN_FAILURE
          , value: error
          }
}

export function setEmail (email){
  return  { type: LOGIN_SET_EMAIL
          , value: email
          }
}

export function setPassword (pass){
  return  { type: LOGIN_SET_PASSWORD
          , value: pass
          }
}


export function dismissModal () {
  return (dispatch, getState) => {
    dispatch(setError(undefined))
  }
}

function resetLoginForm () {
  return  { type: RESET_LOGIN_FORM }
}

export function login(email, password, redirect = false, callback = noop => noop) {
  return (dispatch, getState) => {
    const config = { connection: CONNECTION
                   , email
                   , password
                   , sso: false
                   , scope: 'openid user_metadata'
                   }

    const signInCallback = (error, result) => {
      if (error) {
        dispatch(setError(error))
      } else {
        localStorage["jwt"] = result.idToken
        dispatch({ type: LOGIN_SUCCESS })

        callback(result)
        dispatch(resetLoginForm())
        if(redirect) {
          const path = localStorage['redirect'] || '/reservations'
          delete localStorage['redirect']
          nav.to(path)
        }
      }
    }

    _auth0.loginWithResourceOwner(config, signInCallback)
    dispatch({ type: LOGIN_REQUEST })
  }
}

export function logout(){
  return (dispatch, getState) => {
    dispatch({ type: 'RESET' })
    delete localStorage["jwt"]
    nav.to('/')
  }
}

<<<<<<< HEAD
import _ from 'lodash'

import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'
import { _auth0, CONNECTION }    from  '../helpers/auth0'
=======
import { request }    from '../helpers/request'
import * as nav       from '../helpers/navigation'
import { LOGIN_USER } from '../queries/login.queries.js'
import {setShowModal} from './pageBase.actions'
>>>>>>> feature/new_api

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

<<<<<<< HEAD
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

=======
export function setEmail (value, valid){
  return  { type: LOGIN_SET_EMAIL
          , value: {value, valid}
          }
}

export function setPassword (value, valid){
  return  { type: LOGIN_SET_PASSWORD
          , value: {value, valid}
          }
}

function resetLoginForm () {
  return  { type: RESET_LOGIN_FORM }
}

>>>>>>> feature/new_api

export function dismissModal () {
  return (dispatch, getState) => {
    dispatch(setError(undefined))
  }
}

<<<<<<< HEAD
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
=======
export function login(email, password, redirect = false, callback = ()=>{}) {
  return (dispatch, getState) => {

    const success = (response) => {
      const result = JSON.parse(response.data.login)
      if ('id_token' in result) {
        localStorage['jwt'] = result.id_token
>>>>>>> feature/new_api
        dispatch({ type: LOGIN_SUCCESS })

        callback(result)
        dispatch(resetLoginForm())
        if(redirect) {
          const path = localStorage['redirect'] || '/reservations'
          delete localStorage['redirect']
          nav.to(path)
<<<<<<< HEAD
        }
      }
    }

    _auth0.loginWithResourceOwner(config, signInCallback)
    dispatch({ type: LOGIN_REQUEST })
=======
          dispatch(setShowModal(true))
        }
      } else {
        dispatch(setError(result.error_description || 'no description'))
      }
    }

    dispatch({ type: LOGIN_REQUEST })
    request(success, LOGIN_USER, {email: email, password: password})
>>>>>>> feature/new_api
  }
}

export function logout(){
  return (dispatch, getState) => {
    dispatch({ type: 'RESET' })
<<<<<<< HEAD
    delete localStorage["jwt"]
=======
    delete localStorage['jwt']
>>>>>>> feature/new_api
    nav.to('/')
  }
}

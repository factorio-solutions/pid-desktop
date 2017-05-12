import { request }    from '../helpers/request'
import * as nav       from '../helpers/navigation'
import { LOGIN_USER } from '../queries/login.queries.js'

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


export function dismissModal () {
  return (dispatch, getState) => {
    dispatch(setError(undefined))
  }
}

export function login(email, password, redirect = false, callback = ()=>{}) {
  return (dispatch, getState) => {

    const success = (response) => {
      const result = JSON.parse(response.data.login)
      if ('id_token' in result) {
        localStorage['jwt'] = result.id_token
        dispatch({ type: LOGIN_SUCCESS })

        callback(result)
        dispatch(resetLoginForm())
        if(redirect) {
          const path = localStorage['redirect'] || '/dashboard'
          delete localStorage['redirect']
          nav.to(path)
        }
      } else {
        dispatch(setError(result.error_description || 'no description'))
      }
    }

    const onError = () => {
      dispatch(setError('No response'))
    }

    dispatch({ type: LOGIN_REQUEST })
    request(success, LOGIN_USER, {email: email, password: password},null, onError)
  }
}

export function logout(){
  return (dispatch, getState) => {
    dispatch({ type: 'RESET' })
    delete localStorage['jwt']
    nav.to('/')
  }
}

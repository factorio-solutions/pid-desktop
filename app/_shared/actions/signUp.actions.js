import translate from 'counterpart'

import actionFactory from '../helpers/actionFactory'
import { t }         from '../modules/localization/localization'
import { login }     from './login.actions'
import { request }   from '../helpers/request'
import { mobile }    from '../../index'

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
export const REGISTER_SET_ACCEPT_TERMS_OF_SERVICE = 'REGISTER_SET_ACCEPT_SERVICIES'


const patternInputActionFactory = type => (value, valid) => ({ type, value: { valid, value } })

export const setError = actionFactory(REGISTER_FAILURE)
export const setName = patternInputActionFactory(REGISTER_SET_NAME)
export const setPhone = patternInputActionFactory(REGISTER_SET_PHONE)
export const setEmail = patternInputActionFactory(REGISTER_SET_EMAIL)
export const setPassword = patternInputActionFactory(REGISTER_SET_PASSWORD)
export const setConfirmation = patternInputActionFactory(REGISTER_SET_CONFIRMATION)
export const setResetToken = actionFactory(REGISTER_SET_RESET_TOKEN)
export const setAcceptTermsOfService = actionFactory(REGISTER_SET_ACCEPT_TERMS_OF_SERVICE)


export function dismissModal() {
  return dispatch => dispatch(setError(undefined))
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
          phone:       state.phone.value.replace(/\s/g, ''),
          password:    state.password.value,
          reset_token: state.reset_token,
          language:    translate.getLocale()
        }
      }
    )
  }
}

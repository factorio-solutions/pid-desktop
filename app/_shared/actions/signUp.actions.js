import _ from 'lodash'

import { t }     from '../modules/localization/localization'
import { login } from './login.actions'

import { request }                    from '../helpers/request'
import * as nav                       from '../helpers/navigation'
import { _auth0, CONNECTION, DOMAIN } from '../helpers/auth0'
import { mobile }                     from '../../index'

import { CREATE_USER_QUERY } from '../queries/signUp.queries'

export const REGISTER_REQUEST          = 'REGISTER_REQUEST'
export const REGISTER_SUCCESS          = 'REGISTER_SUCCESS'
export const REGISTER_FAILURE          = 'REGISTER_FAILURE'
export const REGISTER_SET_NAME         = 'REGISTER_SET_NAME'
export const REGISTER_SET_PHONE        = 'REGISTER_SET_PHONE'
export const REGISTER_SET_EMAIL        = 'REGISTER_SET_EMAIL'
export const REGISTER_SET_PASSWORD     = 'REGISTER_SET_PASSWORD'
export const REGISTER_SET_CONFIRMATION = 'REGISTER_SET_CONFIRMATION'
export const REGISTER_SET_RESET_TOKEN  = 'REGISTER_SET_RESET_TOKEN'


export function setError (error){
  return  { type: REGISTER_FAILURE
          , value: error
          }
}

export function setName (name){
  return  { type: REGISTER_SET_NAME
          , value: name
          }
}

export function setPhone (phone){
  return  { type: REGISTER_SET_PHONE
          , value: phone
          }
}

export function setEmail (email){
  return  { type: REGISTER_SET_EMAIL
          , value: email
          }
}

export function setPassword (pass){
  return  { type: REGISTER_SET_PASSWORD
          , value: pass
          }
}

export function setConfirmation (confirm){
  return  { type: REGISTER_SET_CONFIRMATION
          , value: confirm
          }
}

export function setResetToken (token){
  return  { type: REGISTER_SET_RESET_TOKEN
          , value: token
          }
}


export function dismissModal() {
  return(dispatch, getState) => {
    dispatch(setError(undefined))
  }
}

export function init(params){
  return (dispatch, getState) => {
    params.full_name    && dispatch(setName( {value: params.full_name, valid: true} ))
    params.phone        && dispatch(setPhone( {value: params.phone, valid: true} ))
    params.email        && dispatch(setEmail( {value: params.email, valid: true} ))
    params.reset_token  && dispatch(setResetToken( params.reset_token ))
  }
}

export function register(callback = ()=>{}) {
  return (dispatch, getState) => {
    const state = getState().signUp
    // if (password != password_confirmation) {
    //   return dispatch(setError( { details: { description: 'Password and its confirmation are different.' } } ))
    // }
    //
    // const config = { connection: CONNECTION
    //                , email
    //                , password
    //                , auto_login: false
    //                }
    //
    // const auth0LoginSuccess = (result) => {
    //   dispatch({ type: REGISTER_SUCCESS })
    //   callback()
    // }
    //
    // const auth0UpdateSuccess = ()=>{
    //   dispatch( login(email, password, !mobile, auth0LoginSuccess))
    // }
    //
    // const apiCreateOnSuccess = (response) => {
    //   const user_id = response.data.create_user.id
    //   const auth0CreateOnSuccess = (result) => {
    //     update(result, user_id, auth0UpdateSuccess)
    //   }
    //
    //   dispatch( login(email, password, false, auth0CreateOnSuccess))
    // }
    //
    // dispatch({ type: REGISTER_REQUEST })
    // _auth0.signup(config, error => {
    //   if(error) {
    //     dispatch(setError(error))
    //   } else {
    //     request( apiCreateOnSuccess, CREATE_USER_QUERY, { user: { email, full_name, phone } } )
    //   }
    // })

    const auth0LoginSuccess = (result) => {
      dispatch({ type: REGISTER_SUCCESS })
      callback()
    }

    const apiCreateOnSuccess = (response) => {
      if (response.data.create_user == null){
        dispatch({ type: REGISTER_SUCCESS })
        console.log(t(['signup_page', 'userNotCreated']));
        dispatch( setError( t(['signup_page', 'userNotCreated']) ) )
      }else{
        dispatch( login(state.email.value, state.password.value, !mobile, auth0LoginSuccess))
      }
    }

    dispatch({ type: REGISTER_REQUEST })
    request( apiCreateOnSuccess, CREATE_USER_QUERY,
      { user:
        { email: state.email.value,
          full_name: state.name.value,
          phone: state.phone.value,
          password: state.password.value,
          reset_token: state.reset_token
        }
      } )

  }
}


function update({ idTokenPayload: { sub }, idToken }, user_id, callback) {
  var entryPoint = 'https://'+DOMAIN+'/api/v2/users/'+sub

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4){
      callback(JSON.parse(xmlHttp.responseText))
    }
  }

  xmlHttp.open("PATCH", entryPoint, true);
  xmlHttp.setRequestHeader('Content-type', 'application/json')
  xmlHttp.setRequestHeader('Authorization', 'Bearer '+idToken)
  xmlHttp.send(JSON.stringify({ user_metadata: { user_id } }))
}

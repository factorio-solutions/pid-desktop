import { request }   from '../helpers/request'
import actionFactory from '../helpers/actionFactory'
import * as nav      from '../helpers/navigation'

import { CREATE_NEW_CLIENT, EDIT_CLIENT_INIT, EDIT_CLIENT_MUTATION, LOAD_INFO_FROM_IC } from '../queries/newClient.queries'

export const SET_CLIENT_NAME = 'SET_CLIENT_NAME'
export const SET_CLIENT_SMS_API_TOKEN = 'SET_CLIENT_SMS_API_TOKEN'
export const SET_CLIENT_IC = 'SET_CLIENT_IC'
export const SET_CLIENT_DIC = 'SET_CLIENT_DIC'
export const SET_CLIENT_LINE1 = 'SET_CLIENT_LINE1'
export const SET_CLIENT_LINE2 = 'SET_CLIENT_LINE2'
export const SET_CLIENT_CITY = 'SET_CLIENT_CITY'
export const SET_CLIENT_POSTAL_CODE = 'SET_CLIENT_POSTAL_CODE'
export const SET_CLIENT_STATE = 'SET_CLIENT_STATE'
export const SET_CLIENT_COUNTRY = 'SET_CLIENT_COUNTRY'
export const SET_CLIENT_HIGHLIGHT = 'SET_CLIENT_HIGHLIGHT'
export const CLEAR_CLIENT_FORM = 'CLEAR_CLIENT_FORM'


export const setName = actionFactory(SET_CLIENT_NAME)
export const setSmsApiToken = actionFactory(SET_CLIENT_SMS_API_TOKEN)
export const setIC = actionFactory(SET_CLIENT_IC)
export const setDIC = actionFactory(SET_CLIENT_DIC)
export const setLine1 = actionFactory(SET_CLIENT_LINE1)
export const setLine2 = actionFactory(SET_CLIENT_LINE2)
export const setCity = actionFactory(SET_CLIENT_CITY)
export const setPostalCode = actionFactory(SET_CLIENT_POSTAL_CODE)
export const setState = actionFactory(SET_CLIENT_STATE)
export const setCountry = actionFactory(SET_CLIENT_COUNTRY)
export const setHighlight = actionFactory(SET_CLIENT_HIGHLIGHT)
export const clearForm = actionFactory(CLEAR_CLIENT_FORM)


export function toggleHighlight() {
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().newClient.highlight))
  }
}


export function initClient(id) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setName(response.data.client_users[0].client.name))
      dispatch(setSmsApiToken(response.data.client_users[0].client.sms_api_token))
      dispatch(setLine1(response.data.client_users[0].client.address.line_1))
      dispatch(setLine2(response.data.client_users[0].client.address.line_2))
      dispatch(setCity(response.data.client_users[0].client.address.city))
      dispatch(setPostalCode(response.data.client_users[0].client.address.postal_code))
      dispatch(setState(response.data.client_users[0].client.address.state))
      dispatch(setCountry(response.data.client_users[0].client.address.country))
      dispatch(setIC(response.data.client_users[0].client.ic))
      dispatch(setDIC(response.data.client_users[0].client.dic))
    }

    const currentUser = getState().pageBase.current_user
    request(
      onSuccess,
      EDIT_CLIENT_INIT.replace(currentUser && currentUser.pid_admin ? '' : 'sms_api_token', ''),
      { id: parseInt(id, 10) }
    )
  }
}

export function loadFromIc() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      try {
        const res = JSON.parse(response.data.ares).Ares_odpovedi.Odpoved.VBAS

        dispatch(setName(res.OF))
        dispatch(setLine1(res.AD.UC))
        dispatch(setCity(res.AA.N))
        dispatch(setPostalCode(res.AA.PSC))
        dispatch(setCountry(res.AA.NS))
        dispatch(setDIC(res.DIC))
      } catch (e) {
        console.log('not able to parse info from ICO', e)
      }
    }

    request(onSuccess
           , LOAD_INFO_FROM_IC
           , { ic: getState().newClient.ic }
           )
  }
}

function generateClient(state) {
  return {
    name:          state.name,
    sms_api_token: state.smsApiToken,
    ic:            state.ic === '' ? null : state.ic,
    dic:           state.dic === '' ? null : state.dic,
    address:       {
      line_1:      state.line_1,
      line_2:      state.line_2 === '' ? null : state.line_2,
      city:        state.city,
      postal_code: state.postal_code,
      state:       state.state === '' ? null : state.state,
      country:     state.country
    }
  }
}

export function submitNewClient(id) {
  return (dispatch, getState) => {
    const onSuccess = () => {
      dispatch(clearForm())
      nav.to(`/${getState().pageBase.garage}/admin/clients`)
    }

    if (id) { // then edit client
      request(onSuccess, EDIT_CLIENT_MUTATION, {
        id:     parseInt(id, 10),
        client: generateClient(getState().newClient)
      })
    } else { // then new client
      request(onSuccess,
        CREATE_NEW_CLIENT,
        { client: generateClient(getState().newClient) }
      )
    }
  }
}

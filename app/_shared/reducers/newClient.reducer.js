import {
  SET_CLIENT_NAME,
  SET_CLIENT_SMS_API_TOKEN,
  SET_CLIENT_IC,
  SET_CLIENT_DIC,
  SET_CLIENT_LINE1,
  SET_CLIENT_LINE2,
  SET_CLIENT_CITY,
  SET_CLIENT_POSTAL_CODE,
  SET_CLIENT_STATE,
  SET_CLIENT_COUNTRY,
  SET_CLIENT_HIGHLIGHT,
  CLEAR_CLIENT_FORM
}  from '../actions/newClient.actions'

const defaultState = {
  name:        '',
  smsApiToken: '',
  ic:          '',
  dic:         '',
  line_1:      '',
  line_2:      '',
  city:        '',
  postal_code: '',
  state:       '',
  country:     '',
  highlight:   false
}


export default function newClient(appState = defaultState, action) {
  switch (action.type) {

    case SET_CLIENT_NAME:
      return {
        ...appState,
        name: action.value
      }

    case SET_CLIENT_SMS_API_TOKEN:
      return {
        ...appState,
        smsApiToken: action.value
      }

    case SET_CLIENT_IC :
      return {
        ...appState,
        ic: action.value
      }

    case SET_CLIENT_DIC :
      return {
        ...appState,
        dic: action.value
      }

    case SET_CLIENT_LINE1:
      return {
        ...appState,
        line_1: action.value
      }

    case SET_CLIENT_LINE2:
      return {
        ...appState,
        line_2: action.value
      }

    case SET_CLIENT_CITY:
      return {
        ...appState,
        city: action.value
      }

    case SET_CLIENT_POSTAL_CODE:
      return {
        ...appState,
        postal_code: action.value
      }

    case SET_CLIENT_STATE:
      return {
        ...appState,
        state: action.value
      }

    case SET_CLIENT_COUNTRY:
      return {
        ...appState,
        country: action.value
      }

    case SET_CLIENT_HIGHLIGHT:
      return {
        ...appState,
        highlight: action.value
      }

    case CLEAR_CLIENT_FORM:
      return defaultState

    default:
      return appState
  }
}

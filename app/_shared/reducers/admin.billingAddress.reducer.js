import {
  SET_BILLING_ADDRESS_IC,
  SET_BILLING_ADDRESS_DIC,
  SET_BILLING_ADDRESS_NAME,
  SET_BILLING_ADDRESS_LINE1,
  SET_BILLING_ADDRESS_LINE2,
  SET_BILLING_ADDRESS_CITY,
  SET_BILLING_ADDRESS_POSTAL_CODE,
  SET_BILLING_ADDRESS_STATE,
  SET_BILLING_ADDRESS_COUNTRY,
  TOGGLE_BILLING_ADDRESS_HIGHLIGHT,
  CLEAR_BILLING_ADDRESS_FORM
}  from '../actions/admin.billingAddress.actions'

const defaultState = {
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


export default function adminBillingAddress(appState = defaultState, action) {
  switch (action.type) {

    case SET_BILLING_ADDRESS_IC :
      return {
        ...appState,
        ic: action.value
      }

    case SET_BILLING_ADDRESS_DIC :
      return {
        ...appState,
        dic: action.value
      }

    case SET_BILLING_ADDRESS_NAME :
      return {
        ...appState,
        name: action.value
      }

    case SET_BILLING_ADDRESS_LINE1:
      return {
        ...appState,
        line_1: action.value
      }

    case SET_BILLING_ADDRESS_LINE2:
      return {
        ...appState,
        line_2: action.value
      }

    case SET_BILLING_ADDRESS_CITY:
      return {
        ...appState,
        city: action.value
      }

    case SET_BILLING_ADDRESS_POSTAL_CODE:
      return {
        ...appState,
        postal_code: action.value
      }

    case SET_BILLING_ADDRESS_STATE:
      return {
        ...appState,
        state: action.value
      }

    case SET_BILLING_ADDRESS_COUNTRY:
      return {
        ...appState,
        country: action.value
      }

    case TOGGLE_BILLING_ADDRESS_HIGHLIGHT:
      return {
        ...appState,
        highlight: !appState.highlight
      }

    case CLEAR_BILLING_ADDRESS_FORM:
      return defaultState

    default:
      return appState
  }
}

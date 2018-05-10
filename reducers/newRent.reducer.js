import {
  NEW_RENT_SET_NAME,
  NEW_RENT_SET_PRICE,
  NEW_RENT_SET_CURRENCIES,
  NEW_RENT_SET_SELECTED_CURRENCY,
  NEW_RENT_SET_HIGHLIGHT,
  NEW_RENT_CLEAR_CLIENT_FORM
}  from '../actions/newRent.actions'

const defaultState = {
  name:             { value: '', valid: false },
  price:            { value: '', valid: false },
  currencies:       [],
  selectedCurrency: 0,
  highlight:        false
}


export default function newRent(state = defaultState, action) {
  switch (action.type) {

    case NEW_RENT_SET_NAME:
      return {
        ...state,
        name: action.value
      }

    case NEW_RENT_SET_PRICE:
      return {
        ...state,
        price: action.value
      }

    case NEW_RENT_SET_CURRENCIES:
      return {
        ...state,
        currencies: action.value
      }

    case NEW_RENT_SET_SELECTED_CURRENCY:
      return {
        ...state,
        selectedCurrency: action.value
      }

    case NEW_RENT_SET_HIGHLIGHT:
      return {
        ...state,
        highlight: action.value
      }

    case NEW_RENT_CLEAR_CLIENT_FORM:
      return defaultState

    default:
      return state
  }
}

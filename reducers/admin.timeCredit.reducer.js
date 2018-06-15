import {
  TIME_CREDIT_SET_ACTIVE,
  TIME_CREDIT_SET_CURRENCY_NAME,
  TIME_CREDIT_SET_PRICE_PER_HOUR,
  TIME_CREDIT_SET_MONTHLY_AMOUNT,
  TIME_CREDIT_TOGGLE_HIGHLIGHT,
  TIME_CREDIT_SET_SHOW_MODAL,
  TIME_CREDIT_SET_ADD,
  TIME_CREDIT_SET_AMOUNT_TO_ADD
}  from '../actions/admin.timeCredit.actions'


const defaultState = {
  active:        false,
  currencyName:  '',
  pricePerHour:  0,
  monthlyAmount: 0,
  highlight:     false,

  showModal:   false,
  add:         true, // add or remove money
  amountToAdd: 0
}


export default function timeCredit(state = defaultState, action) {
  switch (action.type) {

    case TIME_CREDIT_SET_ACTIVE:
      return {
        ...state,
        active: action.value
      }

    case TIME_CREDIT_SET_CURRENCY_NAME:
      return {
        ...state,
        currencyName: action.value
      }

    case TIME_CREDIT_SET_PRICE_PER_HOUR:
      return {
        ...state,
        pricePerHour: action.value
      }

    case TIME_CREDIT_SET_MONTHLY_AMOUNT:
      return {
        ...state,
        monthlyAmount: action.value
      }

    case TIME_CREDIT_TOGGLE_HIGHLIGHT:
      return {
        ...state,
        highlight: !state.highlight
      }


    case TIME_CREDIT_SET_SHOW_MODAL:
      return {
        ...state,
        showModal: action.value
      }

    case TIME_CREDIT_SET_ADD:
      return {
        ...state,
        add: action.value
      }

    case TIME_CREDIT_SET_AMOUNT_TO_ADD:
      return {
        ...state,
        amountToAdd: parseInt((state.add ? 1 : -1) * action.value, 10)
      }

    default:
      return state
  }
}

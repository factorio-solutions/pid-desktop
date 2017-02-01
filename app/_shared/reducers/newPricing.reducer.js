import {
  NEW_PRICING_SET_NAME,
  NEW_PRICING_SET_FLAT_PRICE,
  NEW_PRICING_SET_EXPONENTIAL_MAX_PRICE,
  NEW_PRICING_SET_EXPONENTIAL_MIN_PRICE,
  NEW_PRICING_SET_EXPONENTIAL_DECAY,
  NEW_PRICING_SET_WEEKEND_PRICE,
  NEW_PRICING_SET_CURRENCIES,
  NEW_PRICING_SET_SELECTED_CURRENCY,
  NEW_PRICING_CLEAR_CLIENT_FORM
}  from '../actions/newPricing.actions'

const defaultState =  { name:                  {value: '', valid: false}
                      , flat_price:            {value: '', valid: false}
                      , exponential_max_price: {value: '', valid: false}
                      , exponential_min_price: {value: '', valid: false}
                      , exponential_decay:     {value: '', valid: false}
                      , weekend_price:         {value: '', valid: false}
                      , currencies:            []
                      , selectedCurrency:      0
                      }


export default function newPricing (state = defaultState, action) {
  switch (action.type) {

    case NEW_PRICING_SET_NAME:
    return  { ...state
            , name: action.value
            }

    case NEW_PRICING_SET_FLAT_PRICE:
    return  { ...state
            , flat_price: action.value
            , exponential_max_price: {value: '', valid: false}
            , exponential_min_price: {value: '', valid: false}
            , exponential_decay:     {value: '', valid: false}
            }

    case NEW_PRICING_SET_EXPONENTIAL_MAX_PRICE:
    return  { ...state
            , exponential_max_price: action.value
            , flat_price: {value: '', valid: false}
            }

    case NEW_PRICING_SET_EXPONENTIAL_MIN_PRICE:
    return  { ...state
            , exponential_min_price: action.value
            , flat_price: {value: '', valid: false}
            }

    case NEW_PRICING_SET_EXPONENTIAL_DECAY:
    return  { ...state
            , exponential_decay: action.value
            , flat_price: {value: '', valid: false}
            }

    case NEW_PRICING_SET_WEEKEND_PRICE:
    return  { ...state
            , weekend_price: action.value
            }

    case NEW_PRICING_SET_CURRENCIES:
    return  { ...state
            , currencies: action.value
            }

    case NEW_PRICING_SET_SELECTED_CURRENCY:
    return  { ...state
            , selectedCurrency: action.value
            }

    case NEW_PRICING_CLEAR_CLIENT_FORM:
    return defaultState

    default:
      return state
  }
}

import {
  NEW_PRICING_SET_NAME,
  NEW_PRICING_SET_FLAT_PRICE,
  NEW_PRICING_SET_EXPONENTIAL_12H_PRICE,
  NEW_PRICING_SET_EXPONENTIAL_DAY_PRICE,
  NEW_PRICING_SET_EXPONENTIAL_WEEK_PRICE,
  NEW_PRICING_SET_EXPONENTIAL_MONTH_PRICE,
  NEW_PRICING_SET_WEEKEND_PRICE,
  NEW_PRICING_SET_CURRENCIES,
  NEW_PRICING_SET_SELECTED_CURRENCY,
  NEW_PRICING_SET_HIGHLIGHT,
  NEW_PRICING_CLEAR_CLIENT_FORM
}  from '../actions/newPricing.actions'

const defaultState =  { name:                    {value: '', valid: false}
                      , flat_price:              {value: '', valid: false}
                      , exponential_12h_price:   {value: '', valid: false}
                      , exponential_day_price:   {value: '', valid: false}
                      , exponential_week_price:  {value: '', valid: false}
                      , exponential_month_price: {value: '', valid: false}
                      , weekend_price:           {value: '', valid: false}
                      , currencies:              []
                      , selectedCurrency:        0
                      , highlight:               false
                      }


export default function newPricing (state = defaultState, action) {
  switch (action.type) {

    case NEW_PRICING_SET_NAME:
    return  { ...state
            , name: action.value
            }

    case NEW_PRICING_SET_FLAT_PRICE:
    return  { ...state
            , flat_price:              action.value
            , exponential_12h_price:   {value: '', valid: false}
            , exponential_day_price:   {value: '', valid: false}
            , exponential_week_price:  {value: '', valid: false}
            , exponential_month_price: {value: '', valid: false}
            }

    case NEW_PRICING_SET_EXPONENTIAL_12H_PRICE:
    return  { ...state
            , exponential_12h_price: action.value
            , flat_price: {value: '', valid: false}
            }

    case NEW_PRICING_SET_EXPONENTIAL_DAY_PRICE:
    return  { ...state
            , exponential_day_price: action.value
            , flat_price: {value: '', valid: false}
            }

    case NEW_PRICING_SET_EXPONENTIAL_WEEK_PRICE:
    return  { ...state
            , exponential_week_price: action.value
            , flat_price: {value: '', valid: false}
            }

    case NEW_PRICING_SET_EXPONENTIAL_MONTH_PRICE:
    return  { ...state
            , exponential_month_price: action.value
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

    case NEW_PRICING_SET_HIGHLIGHT:
    return  { ...state
            , highlight: action.value
            }

    case NEW_PRICING_CLEAR_CLIENT_FORM:
    return defaultState

    default:
      return state
  }
}

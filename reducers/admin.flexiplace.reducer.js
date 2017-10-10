import {
  ADMIN_FLEXIPLACE_SET_PRICINGS,
  ADMIN_FLEXIPLACE_SET_CURRENCIES,
  ADMIN_FLEXIPLACE_SET_PRICING
} from '../actions/admin.flexiplace.actions'

const defaultState = {
  pricings:   [],
  currencies: [],
  pricing:    { // new pricing
    currency_id:             undefined, // selected currency
    flat_price:              undefined,
    exponential_12h_price:   undefined,
    exponential_day_price:   undefined,
    exponential_week_price:  undefined,
    exponential_month_price: undefined,
    weekend_price:           undefined
  }
}


export default function adminFlexiplace(state = defaultState, action) {
  switch (action.type) {

    case ADMIN_FLEXIPLACE_SET_PRICINGS:
      return { ...state,
        pricings: action.value
      }

    case ADMIN_FLEXIPLACE_SET_CURRENCIES:
      return { ...state,
        currencies: action.value
      }

    case ADMIN_FLEXIPLACE_SET_PRICING:
      return { ...state,
        pricing: { ...state.pricing,
          [action.key]: action.value
        }
      }

    default:
      return state
  }
}

import {
  ADMIN_FLEXIPLACE_PRESET_PRICING,
  ADMIN_FLEXIPLACE_SET_CURRENCIES,
  ADMIN_FLEXIPLACE_SET_PRICING,
  ADMIN_FLEXIPLACE_TOGGLE_HIGHLIGHT
} from '../actions/admin.flexiplace.actions'

const defaultState = {
  currencies: [],
  pricing:    { // new pricing
    currency_id:             undefined, // selected currency
    flat_price:              undefined,
    exponential_12h_price:   undefined,
    exponential_day_price:   undefined,
    exponential_week_price:  undefined,
    exponential_month_price: undefined,
    weekend_price:           undefined,

    highlight: false
  }
}


export default function adminFlexiplace(state = defaultState, action) {
  switch (action.type) {

    case ADMIN_FLEXIPLACE_PRESET_PRICING:
      return {
        ...state,
        pricing: action.value
      }

    case ADMIN_FLEXIPLACE_SET_CURRENCIES:
      return {
        ...state,
        currencies: action.value
      }

    case ADMIN_FLEXIPLACE_SET_PRICING:
      if (action.key === 'flat_price') { // seting flat price? remove exponential
        return { ...state,
          pricing: { ...state.pricing,
            [action.key]:            action.value,
            exponential_12h_price:   undefined,
            exponential_day_price:   undefined,
            exponential_week_price:  undefined,
            exponential_month_price: undefined
          }
        }
      } else if (action.key.includes('exponential')) { // setting exponential price? remove flat
        return { ...state,
          pricing: { ...state.pricing,
            [action.key]: action.value,
            flat_price:   undefined
          }
        }
      } else {
        return { ...state,
          pricing: { ...state.pricing,
            [action.key]: action.value
          }
        }
      }

    case ADMIN_FLEXIPLACE_TOGGLE_HIGHLIGHT:
      return {
        ...state,
        highlight: !state.highlight
      }

    default:
      return state
  }
}

import {
  ADMIN_GO_PUBLIC_SET_GARAGE,
  ADMIN_GO_PUBLIC_SET_PLACES,
  ADMIN_GO_PUBLIC_SET_CURRENCIES,
  ADMIN_GO_PUBLIC_SET_CURRENCY_ID,
  ADMIN_GO_PUBLIC_SET_FLAT_PRICE,
  ADMIN_GO_PUBLIC_SET_EXPONENTIAL_12H_PRICE,
  ADMIN_GO_PUBLIC_SET_EXPONENTIAL_DAY_PRICE,
  ADMIN_GO_PUBLIC_SET_EXPONENTIAL_WEEK_PRICE,
  ADMIN_GO_PUBLIC_SET_EXPONENTIAL_MONTH_PRICE,
  ADMIN_GO_PUBLIC_SET_WEEKEND_PRICE,
  ADMIN_GO_PUBLIC_TOGGLE_HIGHLIGHT
}  from '../actions/admin.goPublic.actions'

const defaultState = {
  garage: undefined,
  places: [], // selected places ids

  currencies:  [],
  currency_id: undefined,

  flat_price:              { value: '', valid: false },
  exponential_12h_price:   { value: '', valid: false },
  exponential_day_price:   { value: '', valid: false },
  exponential_week_price:  { value: '', valid: false },
  exponential_month_price: { value: '', valid: false },
  weekend_price:           { value: '', valid: false },

  highlight: false
}


export default function adminGoPublic(state = defaultState, action) {
  switch (action.type) {
    case ADMIN_GO_PUBLIC_SET_GARAGE:
      return {
        ...state,
        garage: action.value
      }

    case ADMIN_GO_PUBLIC_SET_PLACES: {
      if (state.places.length === 0) { // first place selected - set prices
        const place = state.garage ? state.garage.floors
          .reduce((acc, floor) => [ ...acc, ...floor.places ], [])
          .findById(action.value) :
          undefined

        return {
          ...state,
          places:                  [ action.value ],
          flat_price:              { value: place && place.pricing && place.pricing.flat_price, valid: true },
          exponential_12h_price:   { value: place && place.pricing && place.pricing.exponential_12h_price, valid: true },
          exponential_day_price:   { value: place && place.pricing && place.pricing.exponential_day_price, valid: true },
          exponential_week_price:  { value: place && place.pricing && place.pricing.exponential_week_price, valid: true },
          exponential_month_price: { value: place && place.pricing && place.pricing.exponential_month_price, valid: true },
          weekend_price:           { value: place && place.pricing && place.pricing.weekend_price, valid: true },
          currency_id:             place && place.pricing && place.pricing.currency_id
        }
      } else if (state.places.length === 1 && state.places.includes(action.value)) { // last place deselected - remove values
        return {
          ...state,
          places:                  [],
          flat_price:              { value: '', valid: false },
          exponential_12h_price:   { value: '', valid: false },
          exponential_day_price:   { value: '', valid: false },
          exponential_week_price:  { value: '', valid: false },
          exponential_month_price: { value: '', valid: false },
          weekend_price:           { value: '', valid: false },
          currency_id:             undefined
        }
      } else {
        return {
          ...state,
          places: state.places.includes(action.value) ?
            [ ...state.places.slice(0, state.places.indexOf(action.value)), ...state.places.slice(state.places.indexOf(action.value) + 1) ] :
            [ ...state.places, action.value ]
        }
      }
    }

    case ADMIN_GO_PUBLIC_SET_CURRENCIES:
      return {
        ...state,
        currencies: action.value
      }

    case ADMIN_GO_PUBLIC_SET_CURRENCY_ID:
      return {
        ...state,
        currency_id: action.value
      }

    case ADMIN_GO_PUBLIC_SET_FLAT_PRICE:
      return {
        ...state,
        flat_price:              { value: action.value, valid: action.valid },
        exponential_12h_price:   { value: '', valid: false },
        exponential_day_price:   { value: '', valid: false },
        exponential_week_price:  { value: '', valid: false },
        exponential_month_price: { value: '', valid: false }
      }

    case ADMIN_GO_PUBLIC_SET_EXPONENTIAL_12H_PRICE:
      return {
        ...state,
        exponential_12h_price: { value: action.value, valid: action.valid },
        flat_price:            { value: '', valid: false }
      }

    case ADMIN_GO_PUBLIC_SET_EXPONENTIAL_DAY_PRICE:
      return {
        ...state,
        exponential_day_price: { value: action.value, valid: action.valid },
        flat_price:            { value: '', valid: false }
      }

    case ADMIN_GO_PUBLIC_SET_EXPONENTIAL_WEEK_PRICE:
      return {
        ...state,
        exponential_week_price: { value: action.value, valid: action.valid },
        flat_price:             { value: '', valid: false }
      }

    case ADMIN_GO_PUBLIC_SET_EXPONENTIAL_MONTH_PRICE:
      return {
        ...state,
        exponential_month_price: { value: action.value, valid: action.valid },
        flat_price:              { value: '', valid: false }
      }

    case ADMIN_GO_PUBLIC_SET_WEEKEND_PRICE:
      return {
        ...state,
        weekend_price: { value: action.value, valid: action.valid }
      }

    case ADMIN_GO_PUBLIC_TOGGLE_HIGHLIGHT:
      return {
        ...state,
        highlight: !state.highlight
      }

    default:
      return state
  }
}

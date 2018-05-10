import moment from 'moment'

import {
  ANALYTICS_PLACES_SET_GARAGE,
  ANALYTICS_PLACES_SET_FROM,
  ANALYTICS_PLACES_SET_TO,
  ANALYTICS_PLACES_SET_DISPLAY,
  ANALYTICS_PLACES_SET_LOADING
}  from '../actions/analytics.places.actions'


const defaultState = { garage:  undefined,
  from:    moment().subtract(1, 'months').startOf('month').format('DD.MM.YYYY'),
  to:      moment().startOf('month').format('DD.MM.YYYY'),
  display: 'graph',
  loading: false
}


export default function analyticsPlaces(state = defaultState, action) {
  switch (action.type) {

    case ANALYTICS_PLACES_SET_GARAGE:
      return {
        ...state,
        garage: action.value
      }

    case ANALYTICS_PLACES_SET_FROM:
      return {
        ...state,
        from: action.value
      }

    case ANALYTICS_PLACES_SET_TO:
      return {
        ...state,
        to: action.value
      }

    case ANALYTICS_PLACES_SET_DISPLAY:
      return {
        ...state,
        display: action.value
      }

    case ANALYTICS_PLACES_SET_LOADING:
      return {
        ...state,
        loading: action.value
      }

    default:
      return state
  }
}

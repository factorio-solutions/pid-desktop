import moment from 'moment'

import {
  ANALYTICS_SET_RESERVATIONS,
  ANALYTICS_SET_FROM,
  ANALYTICS_SET_TO
}  from '../actions/analytics.payments.actions'


const defaultState = {
  reservations: [],
  from:         moment().subtract(1, 'months').format('M/YYYY'),
  to:           moment().format('M/YYYY')
}


export default function analyticsPayments(state = defaultState, action) {
  switch (action.type) {

    case ANALYTICS_SET_RESERVATIONS:
      return {
        ...state,
        reservations: action.value
      }

    case ANALYTICS_SET_FROM:
      return {
        ...state,
        from: action.value
      }

    case ANALYTICS_SET_TO:
      return {
        ...state,
        to: action.value
      }

    default:
      return state
  }
}

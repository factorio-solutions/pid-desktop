import moment from 'moment'

import {
  ANALYTICS_RESERVATIONS_SET_RESERVATIONS,
  ANALYTICS_RESERVATIONS_SET_FROM,
  ANALYTICS_RESERVATIONS_SET_TO
}  from '../actions/analytics.reservations.actions'


const defaultState =  { reservations: []
                      , from:         moment().startOf('week').format('DD. MM. YYYY')
                      , to:           moment().endOf('week').format('DD. MM. YYYY')
                      }


export default function analyticsReservations (state = defaultState, action) {
  switch (action.type) {

    case ANALYTICS_RESERVATIONS_SET_RESERVATIONS:
      return {...state
             , reservations: action.value
             }

    case ANALYTICS_RESERVATIONS_SET_FROM:
      return {...state
             , from: action.value
             }

    case ANALYTICS_RESERVATIONS_SET_TO:
      return {...state
             , to: action.value
             }

    default:
      return state
  }
}

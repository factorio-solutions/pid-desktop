import moment from 'moment'

import {
  ANALYTICS_RESERVATIONS_SET_RESERVATIONS,
  ANALYTICS_RESERVATIONS_SET_CONTRACTS,
  ANALYTICS_RESERVATIONS_SET_FROM,
  ANALYTICS_RESERVATIONS_SET_TO,
  ANALYTICS_RESERVATIONS_SET_FILTER
}  from '../actions/analytics.reservations.actions'


const defaultState =  { reservations: []
                      , contracts :   []
                      , from:         moment().startOf('week').format('DD. MM. YYYY')
                      , to:           moment().endOf('week').format('DD. MM. YYYY')
                      , filter:       'shortterm'
                      }


export default function analyticsReservations (state = defaultState, action) {
  switch (action.type) {

    case ANALYTICS_RESERVATIONS_SET_RESERVATIONS:
      return {...state
             , reservations: action.value
             }

    case ANALYTICS_RESERVATIONS_SET_CONTRACTS:
      return {...state
             , contracts: action.value
             }

    case ANALYTICS_RESERVATIONS_SET_FROM:
      return {...state
             , from: action.value
             }

    case ANALYTICS_RESERVATIONS_SET_TO:
      return {...state
             , to: action.value
             }

    case ANALYTICS_RESERVATIONS_SET_FILTER:
      return {...state
             , filter: action.value
             }

    default:
      return state
  }
}

import moment from 'moment'

import {
  ANALYTICS_SET_RESERVATIONS,
  ANALYTICS_SET_CONSTRACTS,
  ANALYTICS_SET_FROM,
  ANALYTICS_SET_TO,
  ANALYTICS_SET_PERIOD,
  ANALYTICS_SET_LOADING
}  from '../actions/analytics.garage.actions'


const defaultState =  { reservations: []
                      , contracts:    []
                      , from:         moment().subtract(1, 'months').startOf('month').format('DD.MM.YYYY')
                      , to:           moment().startOf('month').format('DD.MM.YYYY')
                      , period:       'month' // or 'week'
                      , loading:      false
                      }


export default function analyticsGarage (state = defaultState, action) {
  switch (action.type) {

    case ANALYTICS_SET_RESERVATIONS:
      return {...state
             , reservations: action.value
             }

    case ANALYTICS_SET_CONSTRACTS:
      return {...state
             , contracts: action.value
             }

    case ANALYTICS_SET_FROM:
      return {...state
             , from: action.value
             }

    case ANALYTICS_SET_TO:
      return {...state
             , to: action.value
             }

    case ANALYTICS_SET_PERIOD:
      return {...state
             , period: action.value
             }

    case ANALYTICS_SET_LOADING:
      return {...state
             , loading: action.value
             }

    default:
      return state
  }
}

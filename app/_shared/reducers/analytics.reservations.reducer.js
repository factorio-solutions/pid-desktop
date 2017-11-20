import moment from 'moment'

import {
  ANALYTICS_RESERVATIONS_SET_RESERVATIONS,
  ANALYTICS_RESERVATIONS_SET_CONTRACTS,
  ANALYTICS_RESERVATIONS_SET_FROM,
  ANALYTICS_RESERVATIONS_SET_TO,
  ANALYTICS_RESERVATIONS_SET_FILTER,
  ANALYTICS_RESERVATIONS_SET_LOADING
}  from '../actions/analytics.reservations.actions'


const defaultState =  { reservations: []
                      , contracts :   []
                      , from:         moment().startOf('week').format('DD.MM.YYYY')
                      , to:           moment().add(7, 'days').endOf('week').format('DD.MM.YYYY')
                      , filter:       'shortterm'
                      , loading:      false
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
      const differenceFrom = moment(state.to, 'DD.MM.YYYY').diff(moment(action.value, 'DD.MM.YYYY'), 'days')
      return {...state
             , from: action.value
             , to: differenceFrom > 30 ? moment(action.value, 'DD.MM.YYYY').add(30, 'days').format('DD.MM.YYYY')
                 : differenceFrom < 0  ? moment(action.value, 'DD.MM.YYYY').add(14, 'days').format('DD.MM.YYYY')
                                       : state.to
             }

    case ANALYTICS_RESERVATIONS_SET_TO:
      const differenceTo = moment(action.value, 'DD.MM.YYYY').diff(moment(state.from, 'DD.MM.YYYY'), 'days')
      return {...state
             , to: action.value
             , from: differenceTo > 30 ? moment(action.value, 'DD.MM.YYYY').subtract(30, 'days').format('DD.MM.YYYY')
                   : differenceTo < 0  ? moment(action.value, 'DD.MM.YYYY').subtract(14, 'days').format('DD.MM.YYYY')
                                       : state.from
             }

    case ANALYTICS_RESERVATIONS_SET_FILTER:
      return {...state
             , filter: action.value
             }

    case ANALYTICS_RESERVATIONS_SET_LOADING:
      return {...state
             , loading: action.value
             }

    default:
      return state
  }
}

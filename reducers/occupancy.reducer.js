import moment from 'moment'
import {
  OCCUPANCY_SET_GARAGES,
  OCCUPANCY_SET_GARAGE,
  OCCUPANCY_SET_CLIENTS,
  OCCUPANCY_RESET_CLIENTS,
  OCCUPANCY_SET_CLIENT_ID,
  OCCUPANCY_SET_DURATION,
  OCCUPANCY_SET_FROM,
  OCCUPANCY_SET_LOADING,
  OCCUPANCY_SET_NEW_RESERVATION,
  OCCUPANCY_SET_NEW_RESERVATION_NOT_POSSIBLE
}  from '../actions/occupancy.actions'

const defaultState = {
  garages:                [],
  garage:                 undefined,
  clients:                [],
  client_ids:             [],
  duration:               'week',
  from:                   moment().startOf('day'),
  loading:                false,
  newReservation:         undefined,
  reservationNotPossible: false
}


export default function occupancy(state = defaultState, action) {
  switch (action.type) {

    case OCCUPANCY_SET_GARAGES:
      return { ...state,
        garages: action.value
      }

    case OCCUPANCY_SET_GARAGE:
      return { ...state,
        garage:  action.value,
        loading: false
      }

    case OCCUPANCY_SET_CLIENTS:
      return { ...state,
        clients: action.value
      }

    case OCCUPANCY_RESET_CLIENTS:
      return { ...state,
        clients:    [],
        client_ids: []
      }

    case OCCUPANCY_SET_CLIENT_ID: {
      const indexOf = state.client_ids.indexOf(action.value)
      return { ...state,
        client_ids: action.value === undefined ?
          [] :
          indexOf > -1 ?
            [ ...state.client_ids.slice(0, indexOf), ...state.client_ids.slice(indexOf + 1) ] :
            [ ...state.client_ids, action.value ].sort((a, b) => a > b),
        loading: true
      }
    }

    case OCCUPANCY_SET_DURATION:
      return { ...state,
        duration: action.value,
        loading:  true
      }

    case OCCUPANCY_SET_FROM:
      return { ...state,
        from:    action.value,
        loading: true
      }

    case OCCUPANCY_SET_LOADING:
      return { ...state,
        loading: action.value
      }

    case OCCUPANCY_SET_NEW_RESERVATION:
      return { ...state,
        newReservation:         action.value,
        reservationNotPossible: false
      }

    case OCCUPANCY_SET_NEW_RESERVATION_NOT_POSSIBLE:
      return { ...state,
        reservationNotPossible: action.value
      }

    default:
      return state
  }
}

import moment from 'moment'
import {
  SET_GARAGES,
  SET_RESERVATION_TO_BE_REMOVED
}  from '../actions/reservationsBulkRemoval.actions'

const defaultState = {
  garages:     [],
  from:        moment().startOf('day').subtract(10, 'days'),
  to:          moment().endOf('day').add(10, 'days'),
  toBeRemoved: [],
  loading:     false
}

// TODO: Set loading
export default function reservations(state = defaultState, action) {
  switch (action.type) {

    case SET_GARAGES:
      return { ...state,
        garages: action.value
      }

    case SET_RESERVATION_TO_BE_REMOVED:
      return { ...state,
        toBeRemoved: action.value
      }

    default:
      return state
  }
}

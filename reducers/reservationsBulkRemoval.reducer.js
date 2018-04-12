import {
  SET_GARAGES,
  SET_RESERVATION_TO_BE_REMOVED,
  SET_AVAILABLE_USERS,
  SET_USER_ID,
  SET_TO,
  SET_FROM
}  from '../actions/reservationsBulkRemoval.actions'

const defaultState = {
  availableUsers: [],
  garages:        [],
  from:           '',
  to:             '',
  toBeRemoved:    [],
  loading:        false,
  userId:         undefined
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

    case SET_AVAILABLE_USERS:
      return { ...state,
        availableUsers: action.value
      }

    case SET_USER_ID:
      return { ...state,
        userId: action.value
      }

    case SET_FROM:
      return { ...state,
        from: action.value
      }

    case SET_TO:
      return { ...state,
        to: action.value
      }

    default:
      return state
  }
}

import {
  SET_RESERVATIONS,
  TOGGLE_RESERVATIONS_PAST
}  from '../actions/reservations.actions'

const defaultState = {
  reservations: [],
  past:         false
}

export default function reservations(state = defaultState, action) {
  switch (action.type) {

    case SET_RESERVATIONS: // for mobile app
      return { ...state,
        reservations: action.value
      }

    case TOGGLE_RESERVATIONS_PAST:
      return { ...state,
        past: !state.past
      }

    default:
      return state
  }
}

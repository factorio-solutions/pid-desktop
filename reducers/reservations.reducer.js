import {
  SET_RESERVATIONS,
  TOGGLE_RESERVATIONS_PAST
}  from '../actions/reservations.actions'

const defaultState = {
  reservations: [], // is used by mobile version
  past:         false
}

export default function reservations(state = defaultState, action) {
  switch (action.type) {

    case SET_RESERVATIONS: // is userd by mobile version
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

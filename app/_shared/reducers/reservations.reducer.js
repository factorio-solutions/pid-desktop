import {
  SET_ONGOING_RESERVATIONS,
  SET_RESERVATIONS,
  ADD_RESERVATIONS,
  RESERVATIONS_SET_PAGE,
  RESERVATIONS_SET_PAST,
  TOGGLE_RESERVATIONS_PAST,
  RESERVATIONS_PER_PAGE,
  RESERVATIONS_SET_NEW_NOTE,
  RESERVATIONS_SET_NEW_NOTE_RESERVATION
}  from '../actions/reservations.actions'

const defaultState = {
  ongoingReservations: [], // for access page
  reservations:        [],
  canLoadMore:         true,
  page:                1, // current page
  past:                false,

  newNoteReservation: undefined,
  newNote:            ''
}

export default function reservations(state = defaultState, action) {
  switch (action.type) {

    case SET_ONGOING_RESERVATIONS: // for mobile app
      return { ...state,
        ongoingReservations: action.value
      }

    case SET_RESERVATIONS: // for mobile app
      return { ...state,
        reservations: action.value.length > RESERVATIONS_PER_PAGE ? action.value.filter((row, index) => index < RESERVATIONS_PER_PAGE) : action.value,
        page:         1,
        canLoadMore:  action.value.length >= RESERVATIONS_PER_PAGE
      }

    case ADD_RESERVATIONS: // for mobile app
      return { ...state,
        reservations: [ ...state.reservations, ...(action.value.length > RESERVATIONS_PER_PAGE ? action.value.filter((row, index) => index < RESERVATIONS_PER_PAGE) : action.value) ],
        page:         state.page + 1,
        canLoadMore:  action.value.length >= RESERVATIONS_PER_PAGE
      }

    case RESERVATIONS_SET_PAGE: // for mobile app
      return { ...state,
        page: action.value
      }

    case RESERVATIONS_SET_PAST:
      return { ...state,
        past: action.value
      }

    case TOGGLE_RESERVATIONS_PAST:
      return { ...state,
        past: !state.past
      }

    case RESERVATIONS_SET_NEW_NOTE:
      return { ...state,
        newNote: action.value
      }

    case RESERVATIONS_SET_NEW_NOTE_RESERVATION:
      return { ...state,
        newNoteReservation: action.value
      }

    default:
      return state
  }
}

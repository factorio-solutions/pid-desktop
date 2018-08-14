import {
  RESERVATIONS_SET_PAST,
  TOGGLE_RESERVATIONS_PAST,
  RESERVATIONS_SET_NEW_NOTE,
  RESERVATIONS_SET_NEW_NOTE_RESERVATION,
  RESERVATIONS_SET_STATE
}  from '../actions/reservations.actions'

const defaultState = {
  past:               false,
  newNoteReservation: undefined,
  newNote:            '',
  tableState:         undefined
}

export default function reservations(state = defaultState, action) {
  switch (action.type) {

    case RESERVATIONS_SET_PAST:
      return {
        ...state,
        past: action.value
      }

    case TOGGLE_RESERVATIONS_PAST:
      return {
        ...state,
        past: !state.past
      }

    case RESERVATIONS_SET_NEW_NOTE:
      return {
        ...state,
        newNote: action.value
      }

    case RESERVATIONS_SET_NEW_NOTE_RESERVATION:
      return {
        ...state,
        newNoteReservation: action.value
      }

    case RESERVATIONS_SET_STATE:
      return {
        ...state,
        tableState: action.value
      }

    default:
      return state
  }
}

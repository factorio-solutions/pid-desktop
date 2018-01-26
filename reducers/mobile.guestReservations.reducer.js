import { RESERVATIONS_PER_PAGE } from '../actions/reservations.actions'
import {
  SET_GUEST_RESERVATIONS,
  ADD_GUEST_RESERVATIONS,
  GUEST_RESERVATIONS_SET_PAGE
}  from '../actions/mobile.guestReservations.actions'

const defaultState = {
  reservations: [],
  canLoadMore:  true,
  page:         1 // current page
}

export default function guestReservations(state = defaultState, action) {
  switch (action.type) {
    case SET_GUEST_RESERVATIONS: // for mobile app
      return { ...state,
        reservations: action.value.length > RESERVATIONS_PER_PAGE ? action.value.filter((row, index) => index < RESERVATIONS_PER_PAGE) : action.value,
        page:         1,
        canLoadMore:  action.value.length >= RESERVATIONS_PER_PAGE
      }

    case ADD_GUEST_RESERVATIONS: // for mobile app
      return { ...state,
        reservations: [ ...state.reservations, ...(action.value.length > RESERVATIONS_PER_PAGE ? action.value.filter((row, index) => index < RESERVATIONS_PER_PAGE) : action.value) ],
        page:         state.page + 1,
        canLoadMore:  action.value.length >= RESERVATIONS_PER_PAGE
      }

    case GUEST_RESERVATIONS_SET_PAGE: // for mobile app
      return { ...state,
        page: action.value
      }

    default:
      return state
  }
}

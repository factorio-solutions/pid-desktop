import {
  NEW_GUEST_SET_NAME,
  NEW_GUEST_SET_EMAIL,
  NEW_GUEST_SET_PHONE,
  NEW_GUEST_CLEAR_FORM,
  NEW_GUEST_SET_HISTORY,
  NEW_GUEST_UNDO
}  from '../actions/mobile.newGuest.actions'

const defaultState = {
  name:    { value: '', valid: false },
  email:   { value: '', valid: false },
  phone:   { value: '', valid: false },
  history: undefined
}


export default function newGuest(state = defaultState, action) {
  switch (action.type) {

    case NEW_GUEST_SET_NAME:
      return { ...state,
        name: action.value
      }

    case NEW_GUEST_SET_EMAIL:
      return { ...state,
        email: action.value
      }

    case NEW_GUEST_SET_PHONE:
      return { ...state,
        phone: action.value
      }

    case NEW_GUEST_CLEAR_FORM:
      return defaultState

    case NEW_GUEST_SET_HISTORY:
      return { ...state,
        history: state
      }
    case NEW_GUEST_UNDO:
      return state.history

    default:
      return state
  }
}

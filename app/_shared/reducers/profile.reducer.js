import {
  PROFILE_EDIT_USER_SET_NAME,
  PROFILE_EDIT_USER_SET_PHONE,
  PROFILE_SET_CARS,
  PROFILE_TOGGLE_HIGHLIGHT,
  PROFILE_SET_GARAGES,
  PROFILE_SET_CLIENTS,
  PROFILE_SET_CURRENT_PASSWORD,
  PROFILE_SET_CHANGE_COMPLETE
}  from '../actions/profile.actions'

const defaultState = {
  name:            { value: '', valid: false },
  phone:           { value: '', valid: false },
  currentPassword: { value: '', valid: false },
  cars:            [],
  highlight:       false,
  garages:         [],
  clients:         []
}


export default function profile(state = defaultState, action) {
  switch (action.type) {

    case PROFILE_EDIT_USER_SET_NAME:
      return {
        ...state,
        name: action.value
      }

    case PROFILE_EDIT_USER_SET_PHONE:
      return {
        ...state,
        phone: action.value
      }

    case PROFILE_SET_CARS:
      return {
        ...state,
        cars: action.value
      }

    case PROFILE_TOGGLE_HIGHLIGHT:
      return {
        ...state,
        highlight: !state.highlight
      }

    case PROFILE_SET_GARAGES:
      return {
        ...state,
        garages: action.value
      }

    case PROFILE_SET_CLIENTS:
      return {
        ...state,
        clients: action.value
      }

    case PROFILE_SET_CURRENT_PASSWORD:
      return {
        ...state,
        currentPassword: action.value
      }

    default:
      return state
  }
}

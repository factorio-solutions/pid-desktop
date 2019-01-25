import {
  SET_GARAGE_USERS,
  SET_GARAGE_PENDING_USERS,
  SET_GARAGE_USER_GARAGE,
  SET_GARAGE_USERS_SELECTED_ID
}  from '../actions/garageUsers.actions'

const defaultState = {
  users:         [],
  pending_users: [],
  garage:        undefined,
  selectedId:    undefined
}


export default function garageUsers(state = defaultState, action) {
  switch (action.type) {

    case SET_GARAGE_USERS:
      return {
        ...state,
        users: action.value
      }

    case SET_GARAGE_PENDING_USERS:
      return {
        ...state,
        pending_users: action.value
      }

    case SET_GARAGE_USER_GARAGE:
      return {
        ...state,
        garage: action.value
      }

    case SET_GARAGE_USERS_SELECTED_ID:
      return {
        ...state,
        selectedId: action.value
      }

    default:
      return state
  }
}

import {
  SET_CLIENT_USERS,
  SET_CLIENT_USER_CLIENT,
  SET_CLIENT_PENDING_USERS,
  SET_CLIENT_USERS_FILTER,
  SET_CLIENT_USERS_NAME
}  from '../actions/clientUsers.actions'

const defaultState = {
  users:         [],
  client:        {},
  pending_users: [],
  filter:        'all',
  clientName:    ''
}


export default function clientUsers(state = defaultState, action) {
  switch (action.type) {

    case SET_CLIENT_USERS:
      return {
        ...state,
        users: action.value
      }

    case SET_CLIENT_USER_CLIENT:
      return {
        ...state,
        client: action.value
      }

    case SET_CLIENT_PENDING_USERS:
      return {
        ...state,
        pending_users: action.value
      }

    case SET_CLIENT_USERS_FILTER:
      return {
        ...state,
        filter: action.value
      }

    case SET_CLIENT_USERS_NAME:
      return {
        ...state,
        clientName: action.value
      }

    default:
      return state
  }
}

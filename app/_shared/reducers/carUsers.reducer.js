import {
  SET_CAR_USERS,
  SET_CAR_USER_CAR,
  SET_CAR_PENDING_USERS
}  from '../actions/carUsers.actions'

const defaultState = {
  users:         [],
  car:           {},
  pending_users: []
}


export default function carUsers(state = defaultState, action) {
  switch (action.type) {

    case SET_CAR_USERS:
      return { ...state,
        users: action.value
      }

    case SET_CAR_USER_CAR:
      return { ...state,
        car: action.value
      }

    case SET_CAR_PENDING_USERS:
      return { ...state,
        pending_users: action.value
      }

    default:
      return state
  }
}

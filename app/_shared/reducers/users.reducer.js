import { USERS_SET_USERS }  from '../actions/users.actions'

const defaultState =  { users: [] }

<<<<<<< HEAD
=======

>>>>>>> feature/new_api
export default function users (state = defaultState, action) {
  switch (action.type) {

    case USERS_SET_USERS:
    return  { ...state
            , users: action.value
            }

    default:
      return state
  }
}

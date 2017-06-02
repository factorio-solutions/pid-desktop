import {
  USERS_SET_USERS,
  USERS_SET_PENDING,
  USERS_SET_FILTERS
}  from '../actions/users.actions'

const defaultState =  { users:   []
                      , pending: []
                      , filter:  'all' // or 'pending'
                      }


export default function users (state = defaultState, action) {
  switch (action.type) {

    case USERS_SET_USERS:
      return  { ...state
              , users: action.value
              }

    case USERS_SET_PENDING:
      return  { ...state
              , pending: action.value
              }

    case USERS_SET_FILTERS:
      return  { ...state
              , filter: action.value
              }

    default:
      return state
  }
}

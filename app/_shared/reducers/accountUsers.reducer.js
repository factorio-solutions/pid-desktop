import { SET_ACCOUNT_USERS, SET_ACCOUNTUSER_ACCOUNT, SET_ACCOUNT_PENDING_USERS }  from '../actions/accountUsers.actions'

const defaultState =  { users: [],
                        account: {},
                        pending_users: []
                      }

export default function accountUsers (state = defaultState, action) {
  switch (action.type) {

    case SET_ACCOUNT_USERS:
    return  { ...state
            , users: action.value
            }

    case SET_ACCOUNTUSER_ACCOUNT:
    return  { ...state
            , account: action.value
            }

    case SET_ACCOUNT_PENDING_USERS:
    return  { ...state
            , pending_users: action.value
            }

    default:
      return state
  }
}

import { SET_ACCOUNT_NAME, CLEAR_ACCOUNT_FORM }  from '../actions/newAccount.actions'


const defaultState =  { name: ""
                      }

export default function newAccount (state = defaultState, action) {
  switch (action.type) {

    case SET_ACCOUNT_NAME:
    return  { ...state
            , name: action.value
            }

    case CLEAR_ACCOUNT_FORM:
    return defaultState

    default:
      return state
  }
}

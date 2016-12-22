import { EDIT_ACCOUNT_SET_NAME }  from '../actions/editAccount.actions'


const defaultState =  { name: ""
                      }


export default function editAccount (state = defaultState, action) {
  switch (action.type) {

    case EDIT_ACCOUNT_SET_NAME:
    return  { ...state
            , name: action.value
            }

    default:
      return state
  }
}

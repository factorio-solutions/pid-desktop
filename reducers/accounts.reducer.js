import { ACCOUNTS_SET_ACCOUNTS }  from '../actions/accounts.actions'

const defaultState =  { accounts: [] }


export default function accounts (state = defaultState, action) {
  switch (action.type) {

    case ACCOUNTS_SET_ACCOUNTS:
    return  { ...state
            , accounts: action.value
            }

    default:
      return state
  }
}

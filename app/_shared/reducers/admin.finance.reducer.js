import { ADMIN_FINANCE_SET_RENTS }  from '../actions/admin.finance.actions'

const defaultState =  { rents: [] }


export default function adminFinance (state = defaultState, action) {
  switch (action.type) {

    case ADMIN_FINANCE_SET_RENTS:
      return  { ...state
              , rents: action.value
              }

    default:
      return state
  }
}

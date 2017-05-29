import {
  ADMIN_FINANCE_SET_RENTS,
  ADMIN_FINANCE_SET_PAYPAL,
  ADMIN_FINANCE_SET_CSOB,
  ADMIN_FINANCE_SET_ACCOUNT_ID
}  from '../actions/admin.finance.actions'

const defaultState =  { rents: []
                      , paypal: false
                      , csob:false
                      , account_id: undefined
                      }


export default function adminFinance (state = defaultState, action) {
  switch (action.type) {

    case ADMIN_FINANCE_SET_RENTS:
      return  { ...state
              , rents: action.value
              }

    case ADMIN_FINANCE_SET_PAYPAL:
      return  { ...state
              , paypal: action.value
              }

    case ADMIN_FINANCE_SET_CSOB:
      return  { ...state
              , csob: action.value
              }

    case ADMIN_FINANCE_SET_ACCOUNT_ID:
      return  { ...state
              , account_id: action.value
              }

    default:
      return state
  }
}

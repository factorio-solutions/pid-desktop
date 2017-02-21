import {
  INVOICES_SET_INVOICES,
  INVOICES_SET_CLIENT,
  INVOICES_SET_ACCOUNT,
  INVOICES_SET_PAST
}  from '../actions/invoices.actions'

const defaultState =  { invoices: []
                      , client:   undefined
                      , account:  undefined
                      , past:     false
                      }


export default function invoices (state = defaultState, action) {
  switch (action.type) {

    case INVOICES_SET_INVOICES:
    return  { ...state
            , invoices: action.value
            }

    case INVOICES_SET_CLIENT:
    return  { ...state
            , client:  action.value
            , account: undefined
            }

    case INVOICES_SET_ACCOUNT:
    return  { ...state
            , account: action.value
            , client:  undefined
            }

    case INVOICES_SET_PAST:
    return  { ...state
            , past: action.value
            }

    default:
      return state
  }
}

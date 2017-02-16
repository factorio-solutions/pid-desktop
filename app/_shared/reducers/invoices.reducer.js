import { INVOICES_SET_INVOICES }  from '../actions/invoices.actions'

const defaultState =  { invoices: [] }


export default function invoices (state = defaultState, action) {
  switch (action.type) {

    case INVOICES_SET_INVOICES:
    return  { ...state
            , invoices: action.value
            }

    default:
      return state
  }
}

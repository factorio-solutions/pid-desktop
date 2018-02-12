import { SET_PID_ADMIN_FINANCE_INVOICES }  from '../actions/pid-admin.finance.actions'

const defaultState = {
  invoices: []
}

export default function pidAdminFinance(state = defaultState, action) {
  switch (action.type) {

    case SET_PID_ADMIN_FINANCE_INVOICES:
      return {
        ...state,
        invoices: action.value
      }

    default:
      return state
  }
}

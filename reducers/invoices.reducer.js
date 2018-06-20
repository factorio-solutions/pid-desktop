import {
  INVOICES_SET_INVOICES,
  INVOICES_SET_CLIENTS,
  INVOICES_SET_CLIENT_ID,
  INVOICES_SET_PAST,
  INVOICES_SET_REASON,
  INVOICES_TOGGLE_REASON_MODAL,
  INVOICES_SET_USERS_INVOICES
}  from '../actions/invoices.actions'

const defaultState = {
  invoices:      [],
  clients:       [],
  client_id:     undefined,
  past:          false,
  reason:        '', // reason for cancelling invoice
  invoice_id:    undefined, // currently canceling invoice
  showModal:     false,
  usersInvoices: []
}


export default function invoices(state = defaultState, action) {
  switch (action.type) {

    case INVOICES_SET_INVOICES:
      return {
        ...state,
        invoices:         action.value,
        filteredInvoices: action.value // initially no invoices filtered
      }

    case INVOICES_SET_CLIENTS:
      return {
        ...state,
        clients: action.value
      }

    case INVOICES_SET_CLIENT_ID:
      return {
        ...state,
        client_id: action.value
      }

    case INVOICES_SET_PAST:
      return {
        ...state,
        past: action.value
      }

    case INVOICES_SET_REASON:
      return {
        ...state,
        reason: action.value
      }

    case INVOICES_TOGGLE_REASON_MODAL:
      return {
        ...state,
        showModal:  !state.showModal,
        invoice_id: !state.showModal ? action.value : undefined
      }

    case INVOICES_SET_USERS_INVOICES:
      return {
        ...state,
        usersInvoices: action.value
      }

    default:
      return state
  }
}

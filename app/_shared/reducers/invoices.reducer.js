import {
  INVOICES_SET_INVOICES,
  INVOICES_SET_CLIENTS,
  INVOICES_SET_CLIENT_ID,
  INVOICES_SET_GARAGES,
  INVOICES_SET_GARAGE_ID,
  INVOICES_SET_PAST,
  INVOICES_SET_REASON,
  INVOICES_TOGGLE_REASON_MODAL
}  from '../actions/invoices.actions'

const defaultState =  { invoices:  []
                      , clients:   []
                      , client_id: undefined
                      , past:      false
                      , reason:    '' // reason for cancelling invoice
                      , showModal: false
                      }


export default function invoices (state = defaultState, action) {
  switch (action.type) {

    case INVOICES_SET_INVOICES:
      return  { ...state
              , invoices: action.value
              }

    case INVOICES_SET_CLIENTS:
      return  { ...state
              , clients:  action.value
              }

    case INVOICES_SET_CLIENT_ID:
      return  { ...state
              , client_id: action.value
              }

    case INVOICES_SET_PAST:
      return  { ...state
              , past: action.value
              }

    case INVOICES_SET_REASON:
      return  { ...state
              , reason: action.value
              }

    case INVOICES_TOGGLE_REASON_MODAL:
      return  { ...state
              , showModal: !state.showModal
              }

    default:
      return state
  }
}

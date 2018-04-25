import {
  ADMIN_MODULES_SET_GO_PUBLIC,
  ADMIN_MODULES_SET_GO_INTERNAL,
  ADMIN_MODULES_SET_FLEXIPLACE,
  ADMIN_MODULES_SET_MARKETING_PAGE,
  ADMIN_MODULES_SET_MARKETING_SHORT_NAME,
  ADMIN_MODULES_SET_RESERVATION_FORM,
  ADMIN_MODULES_SET_MR_PARKIT_CONNECTION
 }  from '../actions/admin.modules.actions'

const defaultState = {
  goPublic:           false,
  goInternal:         false,
  flexiplace:         false,
  marketing:          false,
  short_name:         undefined,
  reservationForm:    false,
  mrParkitConnection: false
}


export default function adminModules(state = defaultState, action) {
  switch (action.type) {

    case ADMIN_MODULES_SET_GO_PUBLIC:
      return {
        ...state,
        goPublic: action.value
      }

    case ADMIN_MODULES_SET_GO_INTERNAL:
      return {
        ...state,
        goInternal: action.value
      }

    case ADMIN_MODULES_SET_FLEXIPLACE:
      return {
        ...state,
        flexiplace: action.value
      }

    case ADMIN_MODULES_SET_MARKETING_PAGE:
      return {
        ...state,
        marketing: action.value
      }

    case ADMIN_MODULES_SET_MARKETING_SHORT_NAME:
      return {
        ...state,
        short_name: action.value
      }

    case ADMIN_MODULES_SET_RESERVATION_FORM:
      return {
        ...state,
        reservationForm: action.value
      }

    case ADMIN_MODULES_SET_MR_PARKIT_CONNECTION:
      return {
        ...state,
        mrParkitConnection: action.value
      }

    default:
      return state
  }
}

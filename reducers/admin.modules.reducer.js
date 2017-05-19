import {
  ADMIN_MODULES_SET_GO_PUBLIC,
  ADMIN_MODULES_SET_MARKETING_PAGE,
  ADMIN_MODULES_SET_RESERVATION_FORM,
  ADMIN_MODULES_SET_MR_PARKIT_CONNECTION
 }  from '../actions/admin.modules.actions'

const defaultState =  { goPublic: false
                      , marketing: false
                      , reservationForm: false
                      , mrParkitConntection: false
                      }


export default function adminModules (state = defaultState, action) {
  switch (action.type) {

    case ADMIN_MODULES_SET_GO_PUBLIC:
      return  { ...state
              , goPublic: action.value
              }

    case ADMIN_MODULES_SET_MARKETING_PAGE:
      return  { ...state
              , marketing: action.value
              }

    case ADMIN_MODULES_SET_RESERVATION_FORM:
      return  { ...state
              , reservationForm: action.value
              }

    case ADMIN_MODULES_SET_MR_PARKIT_CONNECTION:
      return  { ...state
              , mrParkitConntection: action.value
              }

    default:
      return state
  }
}

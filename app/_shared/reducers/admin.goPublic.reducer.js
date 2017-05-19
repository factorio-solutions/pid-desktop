import {
  ADMIN_GO_PUBLIC_SET_GARAGE,
  ADMIN_GO_PUBLIC_SET_PLACE,
  ADMIN_GO_PUBLIC_SET_CURRENCIES
}  from '../actions/admin.goPublic.actions'

const defaultState =  { garage: undefined
                      , place:  undefined // stores id of place
                      , currencies: []
                      }


export default function adminGoPublic (state = defaultState, action) {
  switch (action.type) {

    case ADMIN_GO_PUBLIC_SET_GARAGE:
      return  { ...state
              , garage: action.value
              }

    case ADMIN_GO_PUBLIC_SET_PLACE:
      return  { ...state
              , place: action.value
              }

    case ADMIN_GO_PUBLIC_SET_CURRENCIES:
      return  { ...state
              , currencies: action.value
              }

    default:
      return state
  }
}

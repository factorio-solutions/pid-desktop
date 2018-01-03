import {
  ADMIN_GO_PUBLIC_SET_GARAGE,
  ADMIN_GO_PUBLIC_SET_PLACES,
  ADMIN_GO_PUBLIC_SET_CURRENCIES
}  from '../actions/admin.goPublic.actions'

const defaultState =  { garage:     undefined
                      , places:     [] // stores ids of places
                      , currencies: []
                      }


export default function adminGoPublic (state = defaultState, action) {
  switch (action.type) {

    case ADMIN_GO_PUBLIC_SET_GARAGE:
      return  { ...state
              , garage: action.value
              }

    case ADMIN_GO_PUBLIC_SET_PLACES:
      return  { ...state
              , places: action.value
              }

    case ADMIN_GO_PUBLIC_SET_CURRENCIES:
      return  { ...state
              , currencies: action.value
              }

    default:
      return state
  }
}

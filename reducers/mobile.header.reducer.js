import { MOBILE_MENU_SET_GARAGES, MOBILE_MENU_SET_GARAGE, MOBILE_MENU_SET_CURRENT_USER }  from '../actions/mobile.header.actions'

const defaultState =  { garages: []
                      , garage_id: undefined
                      , current_user: undefined
                      , headerHeight: 101 //px
                      , online: false
                      }

export default function mobileHeader (state = defaultState, action) {
  switch (action.type) {

    case MOBILE_MENU_SET_GARAGES:
    return  { ...state
            , garages: action.value
            }

    case MOBILE_MENU_SET_GARAGE:
    return  { ...state
            , garage_id: action.value
            }

    case MOBILE_MENU_SET_CURRENT_USER:
    return  { ...state
            , current_user: action.value
            }

    case "MOBIE_MENU_SET_DEVICE_ONLINE":
    return  { ...state
            , online: action.value
            }

    default:
      return state
  }
}

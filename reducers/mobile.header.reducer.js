import {
  MOBILE_MENU_SET_GARAGES,
  MOBILE_MENU_SET_GARAGE,
  MOBILE_MENU_SET_CURRENT_USER,
  MOBILE_MENU_SET_SHOW_MENU,
  MOBILE_MENU_SET_ERROR,
  MOBILE_MENU_SET_CUSTOM_MODAL
}  from '../actions/mobile.header.actions'

const defaultState =  { garages:      []
                      , garage_id:    undefined
                      , current_user: undefined
                      , headerHeight: 101 //px
                      , online:       navigator.connection ? navigator.connection.type !== 'none' : true
                      , showMenu:     false
                      , error:        undefined
                      , custom_modal: undefined
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

    case MOBILE_MENU_SET_SHOW_MENU:
    return  { ...state
            , showMenu: action.value
            }
    case MOBILE_MENU_SET_ERROR:
    return  { ...state
            , error: action.value
            }
    case MOBILE_MENU_SET_CUSTOM_MODAL:
    return  { ...state
            , custom_modal: action.value
            }

    case "MOBIE_MENU_SET_DEVICE_ONLINE":
    return  { ...state
            , online: action.value
            }

    default:
      return state
  }
}

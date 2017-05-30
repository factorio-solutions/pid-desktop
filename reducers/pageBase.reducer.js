import {
  PAGE_BASE_SELECTED,
  PAGE_BASE_SECONDARY_MENU,
  PAGE_BASE_SECONDARY_MENU_SELECTED,
  PAGE_BASE_SHOW_SECONDARY_MENU,
  PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON,
  PAGE_BASE_BREADCRUMBS,
  PAGE_BASE_SET_ERROR,
  PAGE_BASE_SET_SUCCESS,
  PAGE_BASE_SET_CUSTOM_MODAL,
  PAGE_BASE_SET_NOTIFICATIONS_MODAL,
  PAGE_BASE_SET_CURRENT_USER,
  PAGE_BASE_SET_HINT,
  PAGE_BASE_SET_GARAGES,
  PAGE_BASE_SET_GARAGE,
}  from '../actions/pageBase.actions'

const defaultState =  { selected:                undefined // key selected in primary menu
                      , secondaryMenu:           []        // secondary menu content
                      , secondarySelected:       undefined // key selected in secondary menu
                      , showSecondaryMenu:       false // key selected in secondary menu
                      , secondaryMenuBackButton: undefined

                      // breadcrumbs
                      , breadcrumbs: [] // [{label, route}, ... ]

                      // modal windows
                      , error:              undefined
                      , success:              undefined
                      , custom_modal:       undefined
                      , notificationsModal: false

                      //current user
                      , current_user: undefined

                      // page hints
                      , hint:      undefined // {hint, href}

                      // selectedGarage
                      , garages: []
                      , garage: undefined
                      }


export default function pageBase (state = defaultState, action) {
  switch (action.type) {

    case PAGE_BASE_SELECTED:
      return { ...state
             , selected: action.value
             }

    case PAGE_BASE_SECONDARY_MENU:
      return { ...state
             , secondaryMenu: action.value
             }

    case PAGE_BASE_SECONDARY_MENU_SELECTED:
      return { ...state
             , secondarySelected: action.value
             }

    case PAGE_BASE_SHOW_SECONDARY_MENU:
      return { ...state
             , showSecondaryMenu: action.value
             }

    case PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON:
      return { ...state
             , secondaryMenuBackButton: action.value
             }

    case PAGE_BASE_BREADCRUMBS:
      return { ...state
             , breadcrumbs: action.value
             }

    case PAGE_BASE_SET_ERROR:
      return { ...state
             , error: action.value
             }

    case PAGE_BASE_SET_SUCCESS:
      return { ...state
             , success: action.value
             }

    case PAGE_BASE_SET_CUSTOM_MODAL:
      return { ...state
             , custom_modal: action.value
             }

    case PAGE_BASE_SET_NOTIFICATIONS_MODAL:
      return { ...state
             , notificationsModal: action.value
             }

    case PAGE_BASE_SET_CURRENT_USER:
      return { ...state
             , current_user: action.value
             }

    case PAGE_BASE_SET_HINT:
      return { ...state
             , hint: action.value
             }

    case PAGE_BASE_SET_GARAGES:
      return { ...state
             , garages: action.value
             }

    case PAGE_BASE_SET_GARAGE:
      return { ...state
             , garage: action.value
             }

    default:
      return state
  }
}

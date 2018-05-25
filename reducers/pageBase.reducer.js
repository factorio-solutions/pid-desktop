import {
  PAGE_BASE_SELECTED,
  PAGE_BASE_SECONDARY_MENU,
  PAGE_BASE_SECONDARY_MENU_SELECTED,
  PAGE_BASE_SHOW_SECONDARY_MENU,
  PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON,
  PAGE_BASE_SET_ERROR,
  PAGE_BASE_SET_SUCCESS,
  PAGE_BASE_SET_CUSTOM_MODAL,
  PAGE_BASE_SET_NOTIFICATIONS_MODAL,
  PAGE_BASE_SET_CURRENT_USER,
  PAGE_BASE_SET_HINT,
  PAGE_BASE_SET_GARAGES,
  PAGE_BASE_SET_GARAGE,
  PAGE_BASE_SET_PID_TARIF,
  PAGE_BASE_SET_IS_GARAGE_ADMIN,
  PAGE_BASE_SET_IS_GARAGE_MANAGER,
  PAGE_BASE_SET_IS_GARAGE_RECEPTIONIST,
  PAGE_BASE_SET_IS_GARAGE_SECURITY
}  from '../actions/pageBase.actions'

const defaultState = {
  selected:                undefined, // key selected in primary menu
  secondaryMenu:           [],        // secondary menu content
  secondarySelected:       undefined, // key selected in secondary menu
  showSecondaryMenu:       false, // key selected in secondary menu
  secondaryMenuBackButton: undefined,

  // modal windows
  error:              undefined,
  success:            undefined,
  custom_modal:       undefined,
  notificationsModal: true,

  // current user
  current_user: undefined,

  // page hints
  hint: undefined, // {hint, href}

  // selectedGarage
  garages:              [],
  isGarageAdmin:        false, // is admin of currently selected garage?
  isGarageManager:      false, // is admin of currently selected garage?
  isGarageReceptionist: false, // is receptionist of currently selected garage?
  isGarageSecurity:     false, // is security of currently selected garage?
  garage:               undefined,
  pid_tarif:            undefined // tarif of currently selected garage
}


export default function pageBase(state = defaultState, action) {
  switch (action.type) {

    case PAGE_BASE_SELECTED:
      return {
        ...state,
        selected: action.value
      }

    case PAGE_BASE_SECONDARY_MENU:
      return {
        ...state,
        secondaryMenu: action.value
      }

    case PAGE_BASE_SECONDARY_MENU_SELECTED:
      return {
        ...state,
        secondarySelected: action.value
      }

    case PAGE_BASE_SHOW_SECONDARY_MENU:
      return {
        ...state,
        showSecondaryMenu: action.value
      }

    case PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON:
      return {
        ...state,
        secondaryMenuBackButton: action.value
      }

    case PAGE_BASE_SET_ERROR:
      return {
        ...state,
        error: action.value
      }

    case PAGE_BASE_SET_SUCCESS:
      return {
        ...state,
        success: action.value
      }

    case PAGE_BASE_SET_CUSTOM_MODAL:
      return {
        ...state,
        custom_modal: action.value
      }

    case PAGE_BASE_SET_NOTIFICATIONS_MODAL:
      return {
        ...state,
        notificationsModal: action.value
      }

    case PAGE_BASE_SET_CURRENT_USER:
      if (action.value) {
        window.Intercom('boot', {
          app_id:     'gjfjce4s', // Intercom identifier
          name:       action.value.full_name, // Full name
          email:      action.value.email, // Email address
          created_at: +new Date(), // Signup date as a Unix timestamp
          user_hash:  action.value.intercom_user_hash // HMAC using SHA-256
        })
      }
      return {
        ...state,
        current_user: action.value
      }

    case PAGE_BASE_SET_HINT:
      return {
        ...state,
        hint: action.value
      }

    case PAGE_BASE_SET_GARAGES:
      return {
        ...state,
        garages: action.value
      }

    case PAGE_BASE_SET_GARAGE:
      return {
        ...state,
        garage: action.value
      }

    case PAGE_BASE_SET_PID_TARIF:
      return {
        ...state,
        pid_tarif: action.value
      }

    case PAGE_BASE_SET_IS_GARAGE_ADMIN:
      return {
        ...state,
        isGarageAdmin: action.value
      }

    case PAGE_BASE_SET_IS_GARAGE_MANAGER:
      return {
        ...state,
        isGarageManager: action.value
      }

    case PAGE_BASE_SET_IS_GARAGE_RECEPTIONIST:
      return {
        ...state,
        isGarageReceptionist: action.value
      }

    case PAGE_BASE_SET_IS_GARAGE_SECURITY:
      return {
        ...state,
        isGarageSecurity: action.value
      }

    default:
      return state
  }
}

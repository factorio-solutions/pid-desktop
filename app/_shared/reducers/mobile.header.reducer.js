import * as localization from '../modules/localization/localization'

import {
  MOBILE_MENU_SET_GARAGES,
  MOBILE_MENU_SET_GARAGE,
  MOBILE_MENU_SET_CURRENT_USER,
  MOBILE_MENU_SET_SHOW_MENU,
  MOBILE_MENU_SET_ERROR,
  MOBILE_MENU_SET_CUSTOM_MODAL,
  SET_MOBILE_LANGUAGE,
  SET_MOBILE_PERSONAL,
  SET_CURRENT_VERSION,
  SET_SHOW_DROPDOWN,
  SET_SHOW_HAMBURGER,
  SET_SHOW_HEADER,
  SET_HEADER,
  SET_SHOW_BOTTOM_MENU
} from '../actions/mobile.header.actions'

import { SET_NOTIFICATIONS_COUNT } from '../actions/notifications.actions'

const defaultState = {
  garages:            [],
  garage_id:          undefined,
  current_user:       undefined,
  online:             navigator.connection ? navigator.connection.type !== 'none' : true,
  showMenu:           false,
  showDropdown:       false,
  showHeader:         false,
  showHamburger:      false,
  showBottomMenu:     false,
  error:              undefined,
  custom_modal:       undefined,
  notificationsCount: 0,
  language:           'en',
  personal:           true,
  currentVersion:     { version: undefined, lastCheckAt: undefined }
}


export default function mobileHeader(state = defaultState, action) {
  switch (action.type) {
    case MOBILE_MENU_SET_GARAGES:
      return {
        ...state,
        garages: action.value
      }

    case MOBILE_MENU_SET_GARAGE:
      return {
        ...state,
        garage_id: action.value
      }

    case MOBILE_MENU_SET_CURRENT_USER:
      return {
        ...state,
        current_user: action.value
      }

    case MOBILE_MENU_SET_SHOW_MENU:
      return {
        ...state,
        showMenu: action.value
      }

    case MOBILE_MENU_SET_ERROR:
      return {
        ...state,
        error: action.value
      }

    case MOBILE_MENU_SET_CUSTOM_MODAL:
      return {
        ...state,
        custom_modal: action.value
      }

    case SET_NOTIFICATIONS_COUNT:
      return {
        ...state,
        notificationsCount: action.value
      }


    case SET_MOBILE_LANGUAGE:
      localization.changeLanguage(action.value)
      return {
        ...state,
        language: action.value
      }

    case SET_MOBILE_PERSONAL:
      return {
        ...state,
        personal: action.value
      }

    case 'MOBIE_MENU_SET_DEVICE_ONLINE':
      return {
        ...state,
        online: action.value
      }

    case SET_CURRENT_VERSION:
      return {
        ...state,
        currentVersion: action.value
      }

    case SET_SHOW_DROPDOWN:
      return {
        ...state,
        showDropdown: action.value
      }

    case SET_SHOW_HEADER:
      return {
        ...state,
        showHeader: action.value
      }

    case SET_SHOW_HAMBURGER:
      return {
        ...state,
        showHamburger: action.value
      }

    case SET_HEADER:
      return {
        ...state,
        ...action.value
      }

    case SET_SHOW_BOTTOM_MENU:
      return {
        ...state,
        showBottomMenu: action.value
      }

    default:
      return state
  }
}

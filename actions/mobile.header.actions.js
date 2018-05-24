import { request }   from '../helpers/request'
import actionFactory from '../helpers/actionFactory'

import { GET_CURRENT_USER, GET_RESERVABLE_GARAGES } from '../queries/mobile.header.queries'
import { REVOKE_TOKEN }                             from '../queries/login.queries'
import { t }                                        from '../modules/localization/localization'

import { initReservations } from './mobile.reservations.actions'


export const MOBILE_MENU_SET_GARAGES = 'MOBILE_MENU_SET_GARAGES'
export const MOBILE_MENU_SET_GARAGE = 'MOBILE_MENU_SET_GARAGE'
export const MOBILE_MENU_SET_CURRENT_USER = 'MOBILE_MENU_SET_CURRENT_USER'
export const MOBILE_MENU_SET_SHOW_MENU = 'MOBILE_MENU_SET_SHOW_MENU'
export const MOBILE_MENU_SET_ERROR = 'MOBILE_MENU_SET_ERROR'
export const MOBILE_MENU_SET_CUSTOM_MODAL = 'PAGE_BASE_SET_CUSTOM_MODAL'
export const SET_MOBILE_LANGUAGE = 'SET_MOBILE_LANGUAGE'
export const SET_MOBILE_PERSONAL = 'SET_MOBILE_PERSONAL'


export const resetStore = actionFactory('RESET')
export const setGarages = actionFactory(MOBILE_MENU_SET_GARAGES)
export const setGarage = actionFactory(MOBILE_MENU_SET_GARAGE)
export const setCurrentUser = actionFactory(MOBILE_MENU_SET_CURRENT_USER)
export const setShowMenu = actionFactory(MOBILE_MENU_SET_SHOW_MENU)
export const setError = actionFactory(MOBILE_MENU_SET_ERROR)
export const setCustomModal = actionFactory(MOBILE_MENU_SET_CUSTOM_MODAL)
export const setLanguage = actionFactory(SET_MOBILE_LANGUAGE)
// export const setPersonal = actionFactory(SET_MOBILE_PERSONAL)
export function setPersonal(value) {
  return dispatch => {
    dispatch({ type: SET_MOBILE_PERSONAL, value })
    dispatch(initReservations())
  }
}


export function hideSplashscreen() {
  return () => {
    if (navigator.splashscreen) {
      setTimeout(() => navigator.splashscreen.hide, 1000)
    }
  }
}

export function hideCustomSplashscreen() {
  return () => {
    setTimeout(() => {
      document.getElementById('custom-splashscreen')
      .classList.add('hidden')
    }, 1500)
  }
}

export function initGarages() {
  return dispatch => {
    const onGarageSuccess = response => {
      const garages = response.data.reservable_garages
      garages.unshift({ id: undefined, name: t([ 'mobileApp', 'page', 'allGarages' ]) })
      dispatch(setGarages(garages))
    }

    const onSuccess = response => {
      dispatch(setLanguage(response.data.current_user.language))
      dispatch(setCurrentUser(response.data.current_user))
      request(onGarageSuccess, GET_RESERVABLE_GARAGES, { user_id: response.data.current_user.id })
    }
    request(onSuccess, GET_CURRENT_USER)
  }
}

export function toggleMenu() {
  return (dispatch, getState) => {
    dispatch(setShowMenu(!getState().mobileHeader.showMenu))
  }
}

export function logout(revoke, callback) { // delete JWToken and current store
  return dispatch => {
    const onSuccess = () => {
      delete localStorage.jwt
      revoke && delete localStorage.store
      revoke && delete localStorage.refresh_token
      revoke && dispatch(resetStore())
      callback()
    }

    if (revoke) {
      request(onSuccess, REVOKE_TOKEN, { refresh_token: localStorage.refresh_token })
    } else {
      onSuccess()
    }
  }
}

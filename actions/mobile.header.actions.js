import React         from 'react'
import { request }   from '../helpers/request'
import actionFactory from '../helpers/actionFactory'
import moment from 'moment'

import {
  GET_CURRENT_USER,
  GET_RESERVABLE_GARAGES,
  GET_CURRENT_MOBILE_VERSION
} from '../queries/mobile.header.queries'
import { REVOKE_TOKEN }                             from '../queries/login.queries'
import { t }                                        from '../modules/localization/localization'
import { version }                                  from '../../../package.json'

import { initReservations } from './mobile.reservations.actions'
import requestPromise from '../helpers/requestPromise'
import RoundButton from '../components/buttons/RoundButton'


export const MOBILE_MENU_SET_GARAGES = 'MOBILE_MENU_SET_GARAGES'
export const MOBILE_MENU_SET_GARAGE = 'MOBILE_MENU_SET_GARAGE'
export const MOBILE_MENU_SET_CURRENT_USER = 'MOBILE_MENU_SET_CURRENT_USER'
export const MOBILE_MENU_SET_SHOW_MENU = 'MOBILE_MENU_SET_SHOW_MENU'
export const MOBILE_MENU_SET_ERROR = 'MOBILE_MENU_SET_ERROR'
export const MOBILE_MENU_SET_CUSTOM_MODAL = 'PAGE_BASE_SET_CUSTOM_MODAL'
export const SET_MOBILE_LANGUAGE = 'SET_MOBILE_LANGUAGE'
export const SET_MOBILE_PERSONAL = 'SET_MOBILE_PERSONAL'
export const SET_CURRENT_VERSION = 'SET_CURRENT_VERSION'
export const SET_SHOW_DROPDOWN = 'SET_SHOW_DROPDOWN'
export const SET_SHOW_HAMBURGER = 'SET_SHOW_HAMBURGER'
export const SET_SHOW_HEADER = 'SET_SHOW_HEADER'
export const SET_HEADER = 'SET_HEADER'


export const resetStore = actionFactory('RESET')
export const setGarages = actionFactory(MOBILE_MENU_SET_GARAGES)
export const setGarage = actionFactory(MOBILE_MENU_SET_GARAGE)
export const setCurrentUser = actionFactory(MOBILE_MENU_SET_CURRENT_USER)
export const setShowMenu = actionFactory(MOBILE_MENU_SET_SHOW_MENU)
export const setError = actionFactory(MOBILE_MENU_SET_ERROR)
export const setCustomModal = actionFactory(MOBILE_MENU_SET_CUSTOM_MODAL)
export const setLanguage = actionFactory(SET_MOBILE_LANGUAGE)
export const setShowDropdown = actionFactory(SET_SHOW_DROPDOWN)
export const setShowHamburger = actionFactory(SET_SHOW_HAMBURGER)
export const setShowHeader = actionFactory(SET_SHOW_HEADER)
const setHeader = actionFactory(SET_HEADER)


export function setPersonal(value) {
  return dispatch => {
    dispatch({ type: SET_MOBILE_PERSONAL, value })
    dispatch(initReservations())
    dispatch(initGarages())
  }
}

export function setCurrentVersion(currentVersion) {
  return dispatch => {
    dispatch({
      type:  SET_CURRENT_VERSION,
      value: {
        currentVersion,
        lastCheckAt: moment()
      }
    })
  }
}

export function hideSplashscreen() {
  return () => {
    if (navigator.splashscreen) {
      setTimeout(navigator.splashscreen.hide, 1000)
    }
  }
}

export function initGarages() {
  return (dispatch, getState) => {
    const onGarageSuccess = response => {
      const garages = response.data.reservable_garages
      garages.unshift({ id: undefined, name: t([ 'mobileApp', 'page', 'allGarages' ]), order: 1 })

      dispatch(setGarages(garages))
    }

    const onSuccess = response => {
      dispatch(setLanguage(response.data.current_user.language))
      dispatch(setCurrentUser(response.data.current_user))
      request(onGarageSuccess, GET_RESERVABLE_GARAGES, {
        user_id: getState().mobileHeader.personal ? response.data.current_user.id : -1
      })
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

export function getCurrentMobileVersion(platform) {
  return () => {
    return requestPromise(GET_CURRENT_MOBILE_VERSION, { platform })
  }
}

export function showOlderVersionModal() {
  return dispatch => dispatch(setCustomModal(
    <div>
      <div>Spatna veze. Prosim aktualizujte.</div>
      <RoundButton
        content={<span className="fa fa-check" aria-hidden="true" />}
        onClick={() => dispatch(setCustomModal())}
        type="confirm"
      />
    </div>
  ))
}

export function checkCurrentVersion() {
  return async (dispatch, getState) => {
    const { currentVersion } = getState().mobileHeader
    const platform = (window.cordova && window.cordova.platformId) || 'android'
    if (
      currentVersion.lastCheckAt &&
      !moment(currentVersion.lastCheckAt).isSame(moment(), 'day')
    ) {
      const mobileAppVersion = await dispatch(getCurrentMobileVersion(platform)).mobile_app_version

      dispatch(setCurrentVersion(mobileAppVersion))

      if (mobileAppVersion !== version) {
        dispatch(showOlderVersionModal())
      } else {
        console.log('Dobra verze')
      }
    }
  }
}

export function setAllHeader(newShowHeader, newShowHamburger, newShowDropdown) {
  return (dispatch, getState) => {
    const { showHeader, showHamburger, showDropdown } = getState().mobileHeader

    const checkUpdate = (newValue, value) => {
      return newValue !== value && newValue != undefined && typeof newValue === 'boolean'
    }

    const newSettings = {
      showHeader:    newShowHeader || false,
      showHamburger: newShowHamburger || false,
      showDropdown:  newShowDropdown || false
    }
    dispatch(setHeader(newSettings))
  }
}

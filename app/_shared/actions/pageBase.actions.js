import React     from 'react'
import translate from 'counterpart'
import { batchActions } from 'redux-batched-actions'

import ConfirmModal from '../components/modal/ConfirmModal'
import AlertModal   from '../components/modal/AlertModal'

import * as nav      from '../helpers/navigation'
import request from '../helpers/requestPromise'
import actionFactory from '../helpers/actionFactory'
import { t }         from '../modules/localization/localization'

import { GET_CURRENT_USER, GET_GARAGES } from '../queries/pageBase.queries'

export const PAGE_BASE_SELECTED = 'PAGE_BASE_SELECTED'
export const PAGE_BASE_SECONDARY_MENU = 'PAGE_BASE_SECONDARY_MENU'
export const PAGE_BASE_SECONDARY_MENU_SELECTED = 'PAGE_BASE_SECONDARY_MENU_SELECTED'
export const PAGE_BASE_SHOW_SECONDARY_MENU = 'PAGE_BASE_SHOW_SECONDARY_MENU'
export const PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON = 'PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON'
export const PAGE_BASE_SET_ERROR = 'PAGE_BASE_SET_ERROR'
export const PAGE_BASE_SET_SUCCESS = 'PAGE_BASE_SET_SUCCESS'
export const PAGE_BASE_SET_CUSTOM_MODAL = 'PAGE_BASE_SET_CUSTOM_MODAL'
export const PAGE_BASE_SET_NOTIFICATIONS_MODAL = 'PAGE_BASE_SET_NOTIFICATIONS_MODAL'
export const PAGE_BASE_SET_CURRENT_USER = 'PAGE_BASE_SET_CURRENT_USER'
export const PAGE_BASE_SET_HINT = 'PAGE_BASE_SET_HINT'
export const PAGE_BASE_SET_GARAGES = 'PAGE_BASE_SET_GARAGES'
export const PAGE_BASE_SET_GARAGE = 'PAGE_BASE_SET_GARAGE'
export const PAGE_BASE_SET_PID_TARIF = 'PAGE_BASE_SET_PID_TARIF'
export const PAGE_BASE_SET_IS_GARAGE_ADMIN = 'PAGE_BASE_SET_IS_GARAGE_ADMIN'
export const PAGE_BASE_SET_IS_GARAGE_MANAGER = 'PAGE_BASE_SET_IS_GARAGE_MANAGER'
export const PAGE_BASE_SET_IS_GARAGE_RECEPTIONIST = 'PAGE_BASE_SET_IS_GARAGE_RECEPTIONIST'
export const PAGE_BASE_SET_IS_GARAGE_SECURITY = 'PAGE_BASE_SET_IS_GARAGE_SECURITY'
export const PAGE_BASE_SHOW_SCROLL_BAR = 'PAGE_BASE_SHOW_SCROLL_BAR'
export const PAGE_BASE_SET_CURRENT_USER_LANGUAGE = 'PAGE_BASE_SET_CURRENT_USER_LANGUAGE'
export const PAGE_BASE_SET_IN_PID_ADMIN = 'PAGE_BASE_SET_IN_PID_ADMIN'

export const setSelected = actionFactory(PAGE_BASE_SELECTED)
export const setSecondaryMenu = actionFactory(PAGE_BASE_SECONDARY_MENU)
export const setSecondaryMenuSelected = actionFactory(PAGE_BASE_SECONDARY_MENU_SELECTED)
export const setShowSecondaryMenu = actionFactory(PAGE_BASE_SHOW_SECONDARY_MENU)
export const setSecondaryMenuBackButton = actionFactory(PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON)
export const setError = actionFactory(PAGE_BASE_SET_ERROR)
export const setSuccess = actionFactory(PAGE_BASE_SET_SUCCESS)
export const setCustomModal = actionFactory(PAGE_BASE_SET_CUSTOM_MODAL)
export const setShowModal = actionFactory(PAGE_BASE_SET_NOTIFICATIONS_MODAL)
export const setCurrentUser = actionFactory(PAGE_BASE_SET_CURRENT_USER)
export const setGaragePidTarif = actionFactory(PAGE_BASE_SET_PID_TARIF)
export const setIsGarageAdmin = actionFactory(PAGE_BASE_SET_IS_GARAGE_ADMIN)
export const setIsGarageManager = actionFactory(PAGE_BASE_SET_IS_GARAGE_MANAGER)
export const setIsGarageReceptionist = actionFactory(PAGE_BASE_SET_IS_GARAGE_RECEPTIONIST)
export const setIsGarageSecurity = actionFactory(PAGE_BASE_SET_IS_GARAGE_SECURITY)
export const setShowScrollbar = actionFactory(PAGE_BASE_SHOW_SCROLL_BAR)
export const setCurrentUserLanguage = actionFactory(PAGE_BASE_SET_CURRENT_USER_LANGUAGE)
export const setInPidAdmin = actionFactory(PAGE_BASE_SET_IN_PID_ADMIN)

const defaultEmptyArray = []

export function setHint(hint, href = 'https://www.youtube.com/') {
  return {
    type:  PAGE_BASE_SET_HINT,
    value: { hint, href }
  }
}

export function confirm(question, callback) {
  return dispatch => {
    const onBack = () => dispatch(setCustomModal())
    const onConfirm = () => {
      onBack()
      callback()
    }
    dispatch(setCustomModal(<ConfirmModal question={question} onConfirm={onConfirm} onBack={onBack} />))
  }
}

export function alert(question) {
  return dispatch => {
    const onConfirm = () => dispatch(setCustomModal())

    dispatch(setCustomModal(<AlertModal question={question} onConfirm={onConfirm} />))
  }
}

export function setGarages(value) {
  return (dispatch, getState) => {
    dispatch({
      type: PAGE_BASE_SET_GARAGES,
      value
    })

    const selectedGarage = value.find(userGarage => userGarage.garage.id === getState().pageBase.garage)
    if (selectedGarage) {
      dispatch(batchActions([
        setGaragePidTarif(selectedGarage.garage.active_pid_tarif_id),
        setIsGarageAdmin(selectedGarage.admin),
        setIsGarageManager(selectedGarage.manager),
        setIsGarageReceptionist(selectedGarage.receptionist),
        setIsGarageSecurity(selectedGarage.security)
      ], 'PAGE_BASE_SET_GARAGES_USER_INFORMATION'))
    }
  }
}

export function setGarage(value) {
  return (dispatch, getState) => {
    if (window.location.hash.includes(`/${getState().pageBase.garage}/`)) {
      nav.to(`/${value}/` + window.location.hash.split(`/${getState().pageBase.garage}/`)[1].split('?')[0])
    }

    dispatch({
      type: PAGE_BASE_SET_GARAGE,
      value
    })

    const selectedGarage = getState().pageBase.garages.find(userGarage => userGarage.garage.id === value)
    dispatch(batchActions([
      setGaragePidTarif(selectedGarage ? selectedGarage.garage.active_pid_tarif_id : false),
      setIsGarageAdmin(selectedGarage ? selectedGarage.admin : false),
      setIsGarageManager(selectedGarage ? selectedGarage.manager : false),
      setIsGarageReceptionist(selectedGarage ? selectedGarage.receptionist : false),
      setIsGarageSecurity(selectedGarage ? selectedGarage.security : false)
    ], 'PAGE_BASE_SET_GARAGE_USER_INFORMATION'))
  }
}

const secondaryMenuClickFactory = path => () => {
  nav.to(path)
}

function prepareAdminSecondaryMenu() {
  return (dispatch, getState) => {
    const { garage } = getState().pageBase
    const state = getState().pageBase

    return [
      { label: t([ 'pageBase', 'Invoices' ]), key: 'invoices', onClick: secondaryMenuClickFactory(`/${garage}/admin/invoices`) },
      { label: t([ 'pageBase', 'Clients' ]), key: 'clients', onClick: secondaryMenuClickFactory(`/${garage}/admin/clients`) },
      state.isGarageAdmin
      && { label: t([ 'pageBase', 'Modules' ]), key: 'modules', onClick: secondaryMenuClickFactory(`/${garage}/admin/modules/goPublic`) },
      (state.isGarageAdmin || state.isGarageManager)
      && { label: t([ 'pageBase', 'Garage setup' ]), key: 'garageSetup', onClick: secondaryMenuClickFactory(`/${garage}/admin/garageSetup/general`) },
      { label: t([ 'pageBase', 'Users' ]), key: 'users', onClick: secondaryMenuClickFactory(`/${garage}/admin/users`) },
      state.isGarageAdmin
      && { label: t([ 'pageBase', 'Finance' ]), key: 'finance', onClick: secondaryMenuClickFactory(`/${garage}/admin/finance`) }
      //  , state.isGarageAdmin && {label: t(['pageBase', 'PID settings']),  key: "PID",      onClick: secondaryMenuClickFactort(dispatch, `/${garage}/admin/pidSettings`)} }
      // state.isGarageAdmin
      // && { label: t([ 'pageBase', 'Activity log' ]), key: 'activity', onClick: secondaryMenuClickFactory(`/${garage}/admin/activityLog`) }
    ].filter(field => field !== false)
  }
}

function prepareAnalyticsSecondaryMenu(state) {
  const { garage } = state

  return [
    (state.isGarageAdmin || state.isGarageManager) && { label: t([ 'pageBase', 'garageTurnover' ]), key: 'garageTurnover', onClick: secondaryMenuClickFactory(`/${garage}/analytics/garageTurnover`) },
    (state.isGarageAdmin || state.isGarageManager) && { label: t([ 'pageBase', 'reservations' ]), key: 'reservationsAnalytics', onClick: secondaryMenuClickFactory(`/${garage}/analytics/reservationsAnalytics`) },
    (state.isGarageAdmin || state.isGarageManager) && { label: t([ 'pageBase', 'places' ]), key: 'placesAnalytics', onClick: secondaryMenuClickFactory(`/${garage}/analytics/placesAnalytics`) }
    //  , state.isGarageAdmin && {label: t(['pageBase', 'payments']),       key: "paymentsAnalytics",      onClick: secondaryMenuClickFactort(dispatch, `/${garage}/analytics/paymentsAnalytics`) }
    //  , state.isGarageAdmin && {label: t(['pageBase', 'gates']),          key: "gatesAnalytics",         onClick: secondaryMenuClickFactort(dispatch, `/${garage}/analytics/gatesAnalytics`) }
  ].filter(field => field !== false)
}

function prepareSecondaryMenu() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    let secondaryMenu

    if (state.showSecondaryMenu && state.selected === 'admin') {
      secondaryMenu = dispatch(prepareAdminSecondaryMenu())
    } else {
      secondaryMenu = dispatch(prepareAnalyticsSecondaryMenu(state))
    }

    dispatch(setSecondaryMenu(secondaryMenu))
  }
}

function contains(string, text) {
  return string.indexOf(text) !== -1
}

export function fetchCurrentUser() {
  return async (dispatch, getState) => {
    const response = await request(GET_CURRENT_USER)
    const user = response.current_user

    dispatch(setCurrentUser({
      ...user,
      merchant_ids:      user.csob_payment_templates.map(template => template.merchant_id),
      occupancy_garages: response.occupancy_garages
    }))

    if (user.language !== translate.getLocale()) {
      nav.changeLanguage(user.language)
    }
    const state = getState().pageBase

    if (state.showSecondaryMenu) {
      dispatch(prepareSecondaryMenu())
    }
  }
}

export function fetchGarages(goToDashboard = true) {
  return async (dispatch, getState) => {
    const response = await request(GET_GARAGES)

    const userGarages = response.user_garages
      .filter(userGarage => userGarage.user_id === response.current_user.id) // find garages of current user
      .filter(userGarage => !userGarage.pending) // find only garages that are not pending

    dispatch(setGarages(userGarages))
    const garageIdFromUrl = parseInt(window.location.hash.substring(5).split('/')[0], 10) || undefined
    if (!getState().pageBase.garage || (garageIdFromUrl && getState().pageBase.garage !== garageIdFromUrl)) {
      dispatch(setGarage(garageIdFromUrl)) // parse current garage from  URL
    }

    if (userGarages.length > 0 && (getState().pageBase.garage === undefined || userGarages.find(userGarage => userGarage.garage.id === getState().pageBase.garage) === undefined)) {
      // HACK: When it is called form notifications.actions.js then it is do not go to dashboard.
      goToDashboard && nav.to('/occupancy') // if no garage available from URL, select first and redirect to dashboard
      userGarages.length > 0 && dispatch(setGarage(userGarages[0].garage.id))
    }

    const state = getState().pageBase

    if (state.showSecondaryMenu) {
      dispatch(prepareSecondaryMenu())
    }
  }
}


function setAll(selected, secondaryMenu, secondarySelected, hint, href, showSecondaryMenu = false) {
  return dispatch => {
    dispatch(batchActions([
      setSelected(selected),
      setShowSecondaryMenu(showSecondaryMenu),
      setSecondaryMenu(secondaryMenu),
      setSecondaryMenuSelected(secondarySelected),
      setHint(hint, href)
    ], 'MASTER_PAGE_SET_ALL'))
  }
}

export function toDashboard() {
  return dispatch => {
    dispatch(setAll('dashboard', [], undefined, t([ 'pageBase', 'dashboardHint' ]), 'https://www.youtube.com/'))
  }
}

export function toReservations(subPage) {
  return dispatch => {
    let hint

    switch (subPage) { // MainMenu
      case 'overview':
        hint = t([ 'pageBase', 'reservationOverviewHint' ])
        break
      case 'newReservation':
        hint = t([ 'pageBase', 'newReservationHint' ])
        break
      case 'bulkRemoval':
        hint = t([ 'pageBase', 'bulkRemovalHint' ])
        break
      default:
        hint = t([ 'pageBase', 'reservationsHint' ])
    }

    dispatch(setAll('reservations', defaultEmptyArray, undefined, hint, 'https://www.youtube.com/'))
  }
}

export function toOccupancy() {
  return dispatch => {
    dispatch(setAll('occupancy', defaultEmptyArray, undefined, t([ 'pageBase', 'OccupancyOverviewHint' ]), 'https://www.youtube.com/'))
  }
}

export function toGarage() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    if (state.isGarageAdmin || state.isGarageManager || state.isGarageReceptionist || state.isGarageSecurity) {
      dispatch(setAll('garage', defaultEmptyArray, undefined, t([ 'pageBase', 'garagesHint' ]), 'https://www.youtube.com/'))
    } else {
      nav.to('/occupancy')
    }
  }
}

export function toIssues() {
  return dispatch => {
    dispatch(setAll('issues', [], undefined, t([ 'pageBase', 'issuesHint' ]), 'https://www.youtube.com/'))
  }
}

export function toAnalytics(subPage) {
  return (dispatch, getState) => {
    const state = getState().pageBase
    if ((state.isGarageAdmin || state.isGarageManager) && state.pid_tarif >= 2) {
      let secondarySelected
      let hint
      let hintVideo


      switch (subPage) { // MainMenu
        case 'garageTurnover':
          secondarySelected = 'garageTurnover'
          hint = t([ 'pageBase', 'analyticsGarageTurnoverHint' ])
          hintVideo = 'https://www.youtube.com/'
          break

        case 'reservationsAnalytics':
          secondarySelected = 'reservationsAnalytics'
          hint = t([ 'pageBase', 'analyticsreservationsHint' ])
          hintVideo = 'https://www.youtube.com/'
          break

        case 'placesAnalytics':
          secondarySelected = 'placesAnalytics'
          hint = t([ 'pageBase', 'analyticsplacesHint' ])
          hintVideo = 'https://www.youtube.com/'
          break

        case 'paymentsAnalytics':
          secondarySelected = 'paymentsAnalytics'
          hint = t([ 'pageBase', 'analyticspaymentsHint' ])
          hintVideo = 'https://www.youtube.com/'
          break

        case 'gatesAnalytics':
          secondarySelected = 'gatesAnalytics'
          hint = t([ 'pageBase', 'analyticsgatesHint' ])
          hintVideo = 'https://www.youtube.com/'
          break
      }

      dispatch(setAll('analytics', prepareAnalyticsSecondaryMenu(state), secondarySelected, hint, hintVideo, true))
    } else {
      nav.to('/occupancy') // not accessible for this user
    }
  }
}

export function toAdmin(subPage) {
  return (dispatch, getState) => {
    const state = getState().pageBase
    let secondarySelected
    let hint
    const { hash } = window.location

    switch (subPage) { // MainMenu
      case 'editInvoice':
        secondarySelected = 'invoices'
        hint = t([ 'pageBase', 'editInvoiceHint' ])
        break

      case 'invoices':
        secondarySelected = 'invoices'
        hint = t([ 'pageBase', 'invoicesHint' ])
        break

      case (contains(hash, 'pidSettings')):
        if (state.isGarageAdmin) {
          secondarySelected = 'PID'
          hint = t([ 'pageBase', 'pidSettingsHint' ])
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break

      case 'activityLog':
        if (state.isGarageAdmin) {
          secondarySelected = 'activity'
          hint = t([ 'pageBase', 'activityLogHint' ])
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
    }

    dispatch(setAll('admin', dispatch(prepareAdminSecondaryMenu()), secondarySelected, hint, 'https://www.youtube.com/', true))
  }
}

export function toAdminClients(subPage) {
  return dispatch => {
    const secondarySelected = 'clients'
    const hint = t([ 'pageBase', `${subPage || 'clients'}Hint` ])
    const hintVideo = 'https://www.youtube.com/'

    dispatch(setAll('admin', dispatch(prepareAdminSecondaryMenu()), secondarySelected, hint, hintVideo, true))
  }
}

export function toAdminGarageSetup(subPage) {
  return dispatch => {
    const secondarySelected = 'garageSetup'
    const hint = t([ 'pageBase', `${subPage || 'newGarage'}Hint` ])
    const hintVideo = 'https://www.youtube.com/'

    dispatch(setAll('admin', dispatch(prepareAdminSecondaryMenu()), secondarySelected, hint, hintVideo, true))
  }
}

export function toAdminUsers(subPage) {
  return dispatch => {
    const secondarySelected = 'users'
    const hint = t([ 'pageBase', `${subPage || 'users'}Hint` ])
    const hintVideo = 'https://www.youtube.com/'

    dispatch(setAll('admin', dispatch(prepareAdminSecondaryMenu()), secondarySelected, hint, hintVideo, true))
  }
}

export function toAdminFinance(subPage) {
  return (dispatch, getState) => {
    const state = getState().pageBase
    const secondarySelected = 'finance'
    const hint = t([ 'pageBase', `${subPage || 'finance'}Hint` ])
    const hintVideo = 'https://www.youtube.com/'

    if (!state.isGarageAdmin) {
      return nav.to('/occupancy')
    }

    dispatch(setAll('admin', dispatch(prepareAdminSecondaryMenu()), secondarySelected, hint, hintVideo, true))
  }
}

export function toAdminModules(subPage) {
  return (dispatch, getState) => {
    const state = getState().pageBase
    const secondarySelected = 'modules'
    const hint = t([ 'pageBase', `${subPage || 'goPublic'}Hint` ])
    const hintVideo = 'https://www.youtube.com/'

    if (!state.isGarageAdmin) {
      return nav.to('/occupancy')
    }

    dispatch(setAll('admin', dispatch(prepareAdminSecondaryMenu()), secondarySelected, hint, hintVideo, true))
  }
}

export function toAddFeatures(subPage = 'addFeatures') {
  return dispatch => {
    const hint = t([ 'pageBase', `${subPage}Hint` ])

    dispatch(setAll(undefined, [], undefined, hint, 'https://www.youtube.com/'))
  }
}

export function toProfile(subPage) {
  return dispatch => {
    // let secondarySelected = undefined
    let hint = ''
    // let hintVideo = undefined

    switch (subPage) { // MainMenu
      case 'carsUsers':
        hint = t([ 'pageBase', 'carUsersHint' ])
        break
      case 'carsNewCar':
        hint = t([ 'pageBase', 'newCarHint' ])
        break
      case 'carsEdit':
        hint = t([ 'pageBase', 'editCarHint' ])
        break
      default:
        hint = t([ 'pageBase', 'settingsHint' ])
        break
    }
    dispatch(setAll(undefined, defaultEmptyArray, undefined, hint, 'https://www.youtube.com/'))
  }
}

export function toNotifications() {
  return dispatch => {
    dispatch(setAll(undefined, defaultEmptyArray, undefined, t([ 'pageBase', 'notificationsHint' ]), 'https://www.youtube.com/'))
  }
}

export function toPidAdmin(subPage) {
  return (dispatch, getState) => {
    const { current_user: { pid_admin: pidAdmin } } = getState().pageBase
    if (!pidAdmin) {
      nav.to('/occupancy')
    } else {
      dispatch(setAll(subPage, defaultEmptyArray, undefined, undefined, undefined))
    }
  }
}


export function initialPageBase() {
  return (dispatch, getState) => {
    const { hash } = window.location

    if (!contains(hash, 'admin') && !contains(hash, 'analytics')) {
      dispatch(setShowSecondaryMenu(false))
    }

    switch (true) { // MainMenu
      case contains(hash, 'dashboard'):
        dispatch(toDashboard())
        break
      case contains(hash, 'occupancy'):
        dispatch(toOccupancy())
        break
      case (contains(hash, 'garage') && !contains(hash, 'admin') && !contains(hash, 'garageSetup') && !contains(hash, 'analytics')):
        dispatch(toGarage())
        break
      case contains(hash, 'issues'):
        dispatch(toIssues())
        break
      case contains(hash, 'analytics'):
        dispatch(toAnalytics())
        break
      case contains(hash, 'addFeatures'):
        dispatch(toAddFeatures())
        break
      case contains(hash, 'notifications'):
        dispatch(toNotifications())
        break
    }

    if (Object.keys(getState().pageBase.current_user).length <= 1) { // if no information about current user
      dispatch(fetchCurrentUser())
    }
    if (getState().pageBase.garages.length === 0) { // if no garages
      dispatch(fetchGarages())
    }
  }
}

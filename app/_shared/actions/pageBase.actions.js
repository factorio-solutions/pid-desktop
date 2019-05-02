import React     from 'react'
import translate from 'counterpart'
import { batchActions } from 'redux-batched-actions'

import ConfirmModal from '../components/modal/ConfirmModal'
import AlertModal   from '../components/modal/AlertModal'

import * as nav      from '../helpers/navigation'
import request   from '../helpers/request'
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
      dispatch(setGaragePidTarif(selectedGarage.garage.active_pid_tarif_id))
      dispatch(setIsGarageAdmin(selectedGarage.admin))
      dispatch(setIsGarageManager(selectedGarage.manager))
      dispatch(setIsGarageReceptionist(selectedGarage.receptionist))
      dispatch(setIsGarageSecurity(selectedGarage.security))
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
    dispatch(setGaragePidTarif(selectedGarage ? selectedGarage.garage.active_pid_tarif_id : false))
    dispatch(setIsGarageAdmin(selectedGarage ? selectedGarage.admin : false))
    dispatch(setIsGarageManager(selectedGarage ? selectedGarage.manager : false))
    dispatch(setIsGarageReceptionist(selectedGarage ? selectedGarage.receptionist : false))
    dispatch(setIsGarageSecurity(selectedGarage ? selectedGarage.security : false))
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
      && { label: t([ 'pageBase', 'Finance' ]), key: 'finance', onClick: secondaryMenuClickFactory(`/${garage}/admin/finance`) },
      //  , state.isGarageAdmin && {label: t(['pageBase', 'PID settings']),  key: "PID",      onClick: secondaryMenuClickFactort(dispatch, `/${garage}/admin/pidSettings`)} }
      state.isGarageAdmin
      && { label: t([ 'pageBase', 'Activity log' ]), key: 'activity', onClick: secondaryMenuClickFactory(`/${garage}/admin/activityLog`) }
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

export function adminClick() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    const secondaryMenu = dispatch(prepareAdminSecondaryMenu())
    const wasAdminMenuSelected = secondaryMenu.map(o => o.key).includes(state.secondarySelected)

    dispatch(setSecondaryMenu(secondaryMenu))
    dispatch(setSecondaryMenuBackButton({ label: `< ${t([ 'pageBase', 'Admin' ])}`, onClick: () => { dispatch(setShowSecondaryMenu(false)) } }))
    dispatch(setShowSecondaryMenu(!state.showSecondaryMenu || !wasAdminMenuSelected))
    if (!wasAdminMenuSelected) {
      dispatch(setSecondaryMenuSelected('invoices'))
      nav.to(`/${state.garage}/admin/invoices`)
    }
  }
}

export function analyticsClick() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    const secondaryMenu = prepareAnalyticsSecondaryMenu(state)
    const wasAnalyticsMenuSelected = secondaryMenu.map(o => o.key).includes(state.secondarySelected)

    dispatch(setSecondaryMenu(secondaryMenu))
    dispatch(setSecondaryMenuBackButton({ label: `< ${t([ 'pageBase', 'analytics' ])}`, onClick: () => { dispatch(setShowSecondaryMenu(false)) } }))
    dispatch(setShowSecondaryMenu(!state.showSecondaryMenu || !wasAnalyticsMenuSelected)) // if was previously selected, then hide
    if (!wasAnalyticsMenuSelected) {
      dispatch(setSecondaryMenuSelected('garageTurnover'))
      nav.to(`/${state.garage}/analytics/garageTurnover`)
    }
  }
}

function contains(string, text) {
  return string.indexOf(text) !== -1
}

export function fetchCurrentUser() {
  return dispatch => {
    const onSuccess = response => {
      const user = response.data.current_user
      dispatch(setCurrentUser({
        ...user,
        merchant_ids:      user.csob_payment_templates.map(template => template.merchant_id),
        occupancy_garages: response.data.occupancy_garages
      }))
      if (response.data.current_user.language !== translate.getLocale()) {
        nav.changeLanguage(response.data.current_user.language)
      }
    }
    request(onSuccess, GET_CURRENT_USER)
  }
}

export function fetchGarages(goToDashboard = true) {
  return (dispatch, getState) => {
    const onSuccess = response => {
      const userGarages = response.data.user_garages
        .filter(userGarage => userGarage.user_id === response.data.current_user.id) // find garages of current user
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
    }
    request(onSuccess, GET_GARAGES)
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
    let hintVideo
    const { hash } = window.location

    switch (true) { // MainMenu
      case 'editInvoice':
        secondarySelected = 'invoices'
        hint = t([ 'pageBase', 'editInvoiceHint' ])
        hintVideo = 'https://www.youtube.com/'
        break
      case 'invoices':
        secondarySelected = 'invoices'
        hint = t([ 'pageBase', 'invoicesHint' ])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'clients/') && contains(hash, 'users')):
        secondarySelected = 'clients'
        hint = t([ 'pageBase', 'clientUsersHint' ])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'clients/') && contains(hash, 'newClient')):
        secondarySelected = 'clients'
        hint = t([ 'pageBase', 'newClientHint' ])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'clients/') && contains(hash, 'edit') && !contains(hash, 'editContract')):
        secondarySelected = 'clients'
        hint = t([ 'pageBase', 'editClientHint' ])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'clients/') && contains(hash, 'smsSettings')):
        secondarySelected = 'clients'
        hint = t([ 'pageBase', 'smsSettingsHint' ])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'clients/') && contains(hash, 'newContract')):
        secondarySelected = 'clients'
        hint = t([ 'pageBase', 'newContractHint' ])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'clients/') && contains(hash, 'editContract')):
        secondarySelected = 'clients'
        hint = t([ 'pageBase', 'editContractHint' ])
        hintVideo = 'https://www.youtube.com/'
        break
      case contains(hash, 'clients'):
        secondarySelected = 'clients'
        hint = t([ 'pageBase', 'clientsHint' ])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'modules/') && contains(hash, 'marketingSettings')):
        if (state.isGarageAdmin) {
          secondarySelected = 'modules'
          hint = t([ 'pageBase', 'garageNewMarketingHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'modules/') && contains(hash, 'reservationButton')):
        if (state.isGarageAdmin) {
          secondarySelected = 'modules'
          hint = t([ 'pageBase', 'ReservationButtonHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'modules/') && contains(hash, 'mrParkitIntegration')):
        if (state.isGarageAdmin) {
          secondarySelected = 'modules'
          hint = t([ 'pageBase', 'mrParkitIntegrationHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'modules/') && contains(hash, 'goPublic')):
        if (state.isGarageAdmin) {
          secondarySelected = 'modules'
          hint = t([ 'pageBase', 'goPublicHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'modules/') && contains(hash, 'goInternal')):
        if (state.isGarageAdmin) {
          secondarySelected = 'modules'
          hint = t([ 'pageBase', 'goInternalHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'modules/') && contains(hash, 'flexiplace')):
        if (state.isGarageAdmin) {
          secondarySelected = 'modules'
          hint = t([ 'pageBase', 'flexiplaceHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'modules')):
        if (state.isGarageAdmin) {
          secondarySelected = 'modules'
          hint = t([ 'pageBase', 'garageMarketingHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break

      case (contains(hash, 'garageSetup') && contains(hash, 'general')):
        if (state.isGarageAdmin || state.isGarageManager) {
          secondarySelected = 'garageSetup'
          hint = t([ 'pageBase', 'newGarageHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'floors')):
        if (state.isGarageAdmin || state.isGarageManager) {
          secondarySelected = 'garageSetup'
          hint = t([ 'pageBase', 'newGarageFloorsHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'gates')):
        if (state.isGarageAdmin || state.isGarageManager) {
          secondarySelected = 'garageSetup'
          hint = t([ 'pageBase', 'newGarageGatesHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'order')):
        if (state.isGarageAdmin || state.isGarageManager) {
          secondarySelected = 'garageSetup'
          hint = t([ 'pageBase', 'newGarageOrderHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'subscribtion')):
        if (state.isGarageAdmin) {
          secondarySelected = 'garageSetup'
          hint = t([ 'pageBase', 'newGarageSubscribtionHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'legalDocuments')):
        if (state.isGarageAdmin) {
          secondarySelected = 'garageSetup'
          hint = t([ 'pageBase', 'newGarageLegalDocumentsHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'users')):
        if (state.isGarageAdmin || state.isGarageManager) {
          secondarySelected = 'garageSetup'
          hint = t([ 'pageBase', 'garageGarageUsersHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break

      case (!contains(hash, 'clients') && !contains(hash, 'garageSetup') && contains(hash, 'users') && contains(hash, 'invite')):
        secondarySelected = 'users'
        hint = t([ 'pageBase', 'inviteUsersHint' ])
        hintVideo = 'https://www.youtube.com/'
        break
      case (!contains(hash, 'clients') && contains(hash, 'users')):
        secondarySelected = 'users'
        hint = t([ 'pageBase', 'usersHint' ])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'finance') && contains(hash, 'paypal')):
        if (state.isGarageAdmin) {
          secondarySelected = 'finance'
          hint = t([ 'pageBase', 'financePaypalHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'finance') && contains(hash, 'csob')):
        if (state.isGarageAdmin) {
          secondarySelected = 'finance'
          hint = t([ 'pageBase', 'financeCSOBHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'finance') && contains(hash, 'newRent')):
        if (state.isGarageAdmin) {
          secondarySelected = 'finance'
          hint = t([ 'pageBase', 'garageNewRentHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'finance') && contains(hash, 'editRent')):
        if (state.isGarageAdmin) {
          secondarySelected = 'finance'
          hint = t([ 'pageBase', 'garageEditRentHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
      case (contains(hash, 'finance')):
        if (state.isGarageAdmin) {
          secondarySelected = 'finance'
          hint = t([ 'pageBase', 'financeHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break

      case (contains(hash, 'pidSettings')):
        if (state.isGarageAdmin) {
          secondarySelected = 'PID'
          hint = t([ 'pageBase', 'pidSettingsHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break

      case (contains(hash, 'activityLog')):
        if (state.isGarageAdmin) {
          secondarySelected = 'activity'
          hint = t([ 'pageBase', 'activityLogHint' ])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/occupancy') // not accessible for this user
        }
        break
    }

    dispatch(setAll('admin', dispatch(prepareAdminSecondaryMenu()), secondarySelected, hint, hintVideo, true))
  }
}

export function toAddFeatures() {
  return dispatch => {
    const { hash } = window.location

    switch (true) { // MainMenu
      case (contains(hash, 'gateModuleOrder')):
        dispatch(setAll(undefined, [], undefined, t([ 'pageBase', 'orderGarageModuleHint' ]), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'general')):
        dispatch(setAll(undefined, [], undefined, t([ 'pageBase', 'newGarageHint' ]), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'floors')):
        dispatch(setAll(undefined, [], undefined, t([ 'pageBase', 'newGarageFloorsHint' ]), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'gates')):
        dispatch(setAll(undefined, [], undefined, t([ 'pageBase', 'newGarageGatesHint' ]), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'order')):
        dispatch(setAll(undefined, [], undefined, t([ 'pageBase', 'newGarageOrderHint' ]), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'subscribtion')):
        dispatch(setAll(undefined, [], undefined, t([ 'pageBase', 'newGarageSubscribtionHint' ]), 'https://www.youtube.com/'))
        break
      default:
        dispatch(setAll(undefined, [], undefined, t([ 'pageBase', 'addFeaturesHint' ]), 'https://www.youtube.com/'))
        break
    }
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
      case (contains(hash, 'reservations') && !contains(hash, 'analytics')):
        dispatch(toReservations())
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
      case contains(hash, 'admin'):
        dispatch(toAdmin())
        break
      case contains(hash, 'addFeatures'):
        dispatch(toAddFeatures())
        break
      case contains(hash, 'profile'):
        dispatch(toProfile())
        break
      case contains(hash, 'notifications'):
        dispatch(toNotifications())
        break
    }

    if (getState().pageBase.current_user === undefined) { // if no information about current user
      dispatch(fetchCurrentUser())
    }
    if (getState().pageBase.garages.length === 0) { // if no garages
      dispatch(fetchGarages())
    }
  }
}

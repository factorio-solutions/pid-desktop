import * as nav    from '../helpers/navigation'
import { request } from '../helpers/request'
import {t}         from '../modules/localization/localization'

import { GET_CURRENT_USER, UPDATE_CURRENT_USER } from '../queries/pageBase.queries'

export const PAGE_BASE_SELECTED                       = 'PAGE_BASE_SELECTED'
export const PAGE_BASE_SECONDARY_MENU                 = 'PAGE_BASE_SECONDARY_MENU'
export const PAGE_BASE_SECONDARY_MENU_SELECTED        = 'PAGE_BASE_SECONDARY_MENU_SELECTED'
export const PAGE_BASE_SHOW_SECONDARY_MENU            = 'PAGE_BASE_SHOW_SECONDARY_MENU'
export const PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON = 'PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON'
export const PAGE_BASE_BREADCRUMBS                    = 'PAGE_BASE_BREADCRUMBS'
export const PAGE_BASE_SET_ERROR                      = 'PAGE_BASE_SET_ERROR'
export const PAGE_BASE_SET_CUSTOM_MODAL               = 'PAGE_BASE_SET_CUSTOM_MODAL'
export const PAGE_BASE_SET_NOTIFICATIONS_MODAL        = 'PAGE_BASE_SET_NOTIFICATIONS_MODAL'
export const PAGE_BASE_SET_CURRENT_USER               = 'PAGE_BASE_SET_CURRENT_USER'
export const PAGE_BASE_SET_HINT                       = 'PAGE_BASE_SET_HINT'
export const PAGE_BASE_SET_GARAGE                     = 'PAGE_BASE_SET_GARAGE'



export function setSelected(value) {
  return { type: PAGE_BASE_SELECTED
         , value
         }
}

export function setSecondaryMenu(value) {
  return { type: PAGE_BASE_SECONDARY_MENU
         , value
         }
}

export function setSecondaryMenuSelected(value) {
  return { type: PAGE_BASE_SECONDARY_MENU_SELECTED
         , value
         }
}

export function setShowSecondaryMenu(value) {
  return { type: PAGE_BASE_SHOW_SECONDARY_MENU
         , value
         }
}

export function setSecondaryMenuBackButton(value) {
  return { type: PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON
         , value
         }
}

export function setBreadcrumbs(value) {
  return { type: PAGE_BASE_BREADCRUMBS
         , value
         }
}

export function setError(value) {
  return { type: PAGE_BASE_SET_ERROR
         , value
         }
}

export function setCustomModal(value) {
  return { type: PAGE_BASE_SET_CUSTOM_MODAL
         , value
         }
}

export function setShowModal(value) {
  return { type: PAGE_BASE_SET_NOTIFICATIONS_MODAL
         , value
         }
}

export function setCurrentUser(value) {
  return { type: PAGE_BASE_SET_CURRENT_USER
         , value
         }
}

export function setHint(hint, href) {
  return { type: PAGE_BASE_SET_HINT
        //  , value: hint ? { hint, href }: undefined
         , value: { hint, href }
         }
}

export function setGarage(value) {
  return { type: PAGE_BASE_SET_GARAGE
         , value
         }
}


function prepareAdminSecondaryMenu() {
  return (dispatch, getState) => {
    const garage = getState().pageBase.garage
    return [ {label: t(['pageBase', 'Invoices']),      key: "invoices", onClick: ()=>{nav.to(`/${garage}/admin/invoices`)} }
           , {label: t(['pageBase', 'Clients']),       key: "clients",  onClick: ()=>{nav.to(`/${garage}/admin/clients`)} }
           , {label: t(['pageBase', 'Modules']),       key: "modules",  onClick: ()=>{nav.to(`/${garage}/admin/modules`)} }
           , {label: t(['pageBase', 'Garage setup']),  key: "garage",   onClick: ()=>{nav.to(`/${garage}/admin/garageSetup/general`)} }
           , {label: t(['pageBase', 'Users']),         key: "users",    onClick: ()=>{nav.to(`/${garage}/admin/users`)} }
           , {label: t(['pageBase', 'Finance']),       key: "finance",  onClick: ()=>{nav.to(`/${garage}/admin/finance`)} }
           , {label: t(['pageBase', 'PID settings']),  key: "PID",      onClick: ()=>{nav.to(`/${garage}/admin/pidSettings`)} }
           , {label: t(['pageBase', 'Activity log']),  key: "activity", onClick: ()=>{nav.to(`/${garage}/admin/activityLog`)} }
           ]
  }
}

export function adminClick() {
  return (dispatch, getState) => {
    dispatch(setSecondaryMenu(dispatch(prepareAdminSecondaryMenu())))
    dispatch(setSecondaryMenuBackButton({label: `< ${t(['pageBase', 'Admin'])}`, onClick: ()=>{dispatch(setShowSecondaryMenu(false))}}))
    dispatch(setShowSecondaryMenu(!getState().pageBase.showSecondaryMenu))
  }
}

function contains (string, text) {
  return string.indexOf(text) != -1
}

export function fetchCurrentUser(){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setCurrentUser( response.data.current_user ) )
    }
    request(onSuccess, GET_CURRENT_USER)
  }
}


export function initialPageBase () {
  return (dispatch, getState) => {
    const hash = window.location.hash
    dispatch(setShowSecondaryMenu(false))

    switch (true) { // MainMenu
      case contains(hash, 'dashboard'):
        dispatch(toDashboard())
        break;
      case contains(hash, 'reservations'):
        dispatch(toReservations())
        break;
      case contains(hash, 'occupancy'):
        dispatch(toOccupancy())
        break;
      case (contains(hash, 'garage') && !contains(hash, 'admin')):
        dispatch(toGarage())
        break;
      case contains(hash, 'issues'):
        dispatch(toIssues())
        break;
      case contains(hash, 'analytics'):
        dispatch(toAnalytics())
        break;
      case contains(hash, 'admin'):
        dispatch(toAdmin())
        break;
      case contains(hash, 'addFeatures'):
        dispatch(toAddFeatures())
        break;
      case contains(hash, 'profile'):
        dispatch(toProfile())
        break;
      case contains(hash, 'notifications'):
        dispatch(toNotifications())
        break;
    }

    //     dispatch(setHint(t(['pageBase', 'EditUserHint']), 'https://www.youtube.com/'))

    if (getState().pageBase.current_user == undefined){ // if no information about current user
      dispatch(fetchCurrentUser())
    }
  }
}

function setAll(selected, secondartMenu, secondarySelected, breadcrumbs, hint, href) {
  return (dispatch, getState) => {
    dispatch(setSelected(selected))
    dispatch(setSecondaryMenu(secondartMenu))
    dispatch(setSecondaryMenuSelected(secondarySelected))
    dispatch(setBreadcrumbs(breadcrumbs))
    dispatch(setHint(hint,href))
  }
}

export function toDashboard() {
  return (dispatch, getState) => {
    dispatch(setAll('dashboard', [], undefined, [{label: t(['pageBase','Dashboard']), route: '/dashboard'}],  t(['pageBase','dashboardHint']), 'https://www.youtube.com/'))
  }
}

export function toReservations() {
  return (dispatch, getState) => {
    const hash = window.location.hash
    let breadcrumbs = [{label: t(['pageBase','Reservation']), route: '/reservations'}]

    switch (true) { // MainMenu
      case contains(hash, 'newReservations'):
        breadcrumbs.push({label: t(['pageBase','New Reservation']), route: '/reservations/newReservations'})
      case contains(hash, 'overview'):
        breadcrumbs.push({label: t(['newReservationOverview','overview']), route: '/reservations/newReservations/overview'})
      }

    dispatch(setAll('reservations', [], undefined, breadcrumbs, t(['pageBase','reservationsHint']), 'https://www.youtube.com/'))
  }
}

export function toOccupancy() {
  return (dispatch, getState) => {
    dispatch(setAll('occupancy', [], undefined, [{label: t(['pageBase','Occupancy']), route: '/occupancy'}], t(['pageBase','OccupancyOverviewHint']), 'https://www.youtube.com/'))
  }
}

export function toGarage() {
  return (dispatch, getState) => {
    dispatch(setAll('garage', [], undefined, [{label: t(['pageBase','Garage']), route: '/garage'}], t(['pageBase','garagesHint']), 'https://www.youtube.com/'))
  }
}

export function toIssues() {
  return (dispatch, getState) => {
    dispatch(setAll('issues', [], undefined, [{label: t(['pageBase','Issues']), route: '/issues'}], t(['pageBase','issuesHint']), 'https://www.youtube.com/'))
  }
}

export function toAnalytics() {
  return (dispatch, getState) => {
    dispatch(setAll('analytics', [], undefined, [{label: t(['pageBase','Analytics']), route: '/analytics'}], t(['pageBase','analyticsHint']), 'https://www.youtube.com/'))
  }
}

export function toAdmin() {
  return (dispatch, getState) => {
    const hash = window.location.hash
    const garage = getState().pageBase.garage
    let breadcrumbs = [{label: t(['pageBase','Admin']), route: `/${garage}/admin/invoices`}]
    let secondarySelected = undefined
    let hint = undefined
    let hintVideo = undefined

    switch (true) { // MainMenu
      case contains(hash, 'invoices'):
        breadcrumbs.push({label: t(['pageBase','Invoices']), route: `/${garage}/admin/invoices`})
        secondarySelected = 'invoices'
        hint = t(['pageBase','invoicesHint'])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'clients/') && contains(hash, 'users')):
        breadcrumbs.push({label: t(['pageBase','Clients']), route: `/${garage}/admin/clients`})
        breadcrumbs.push({label: t(['pageBase','Users']), route: `/${garage}/admin/clients`}) // users
        secondarySelected = 'clients'
        hint = t(['pageBase','clientUsersHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'clients/') && contains(hash, 'newClient')):
        breadcrumbs.push({label: t(['pageBase','Clients']), route: `/${garage}/admin/clients`})
        breadcrumbs.push({label: t(['pageBase','NewClient']), route: `/${garage}/admin/clients/newClient`})
        secondarySelected = 'clients'
        hint = t(['pageBase','newClientHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'clients/') && contains(hash, 'newContract')):
        breadcrumbs.push({label: t(['pageBase','Clients']), route: `/${garage}/admin/clients`})
        breadcrumbs.push({label: t(['pageBase','NewContract']), route: `/${garage}/admin/clients/newContract`})
        secondarySelected = 'clients'
        hint = t(['pageBase','newContractHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case contains(hash, 'clients'):
        breadcrumbs.push({label: t(['pageBase','Clients']), route: `/${garage}/admin/clients`})
        secondarySelected = 'clients'
        hint = t(['pageBase','clientsHint'])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'modules/') && contains(hash, 'marketingSettings')):
        breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
        breadcrumbs.push({label: t(['pageBase','marketingSettings']), route: `/${garage}/admin/modules/marketingSettings`})
        secondarySelected = 'modules'
        hint = t(['pageBase','garageNewMarketingHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'modules/') && contains(hash, 'reservationButton')):
        breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
        breadcrumbs.push({label: t(['pageBase','reservationButton']), route: `/${garage}/admin/modules/reservationButton`})
        secondarySelected = 'modules'
        hint = t(['pageBase','ReservationButtonHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'modules/') && contains(hash, 'mrParkitIntegration')):
        breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
        breadcrumbs.push({label: t(['pageBase','mrParkitIntegration']), route: `/${garage}/admin/modules/mrParkitIntegration`})
        secondarySelected = 'modules'
        hint = t(['pageBase','mrParkitIntegrationHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'modules/') && contains(hash, 'goPublic')):
        breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
        breadcrumbs.push({label: t(['pageBase','goPublic']), route: `/${garage}/admin/modules/goPublic`})
        secondarySelected = 'modules'
        hint = t(['pageBase','goPublicHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'modules')):
        breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
        secondarySelected = 'modules'
        hint = t(['pageBase','garageMarketingHint'])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'garageSetup') && contains(hash, 'gates')):
        breadcrumbs.push({label: t(['pageBase','Garage setup']), route: `/${garage}/admin/garageSetup/general`})
        secondarySelected = 'garageSetup'
        hint = t(['pageBase','newGarageHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'general')):
        breadcrumbs.push({label: t(['pageBase','garageSetupFloors']), route: `/${garage}/admin/garageSetup/floors`})
        secondarySelected = 'garageSetup'
        hint = t(['pageBase','newGarageFloorsHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'floors')):
        breadcrumbs.push({label: t(['pageBase','garageSetupGates']), route: `/${garage}/admin/garageSetup/gates`})
        secondarySelected = 'garageSetup'
        hint = t(['pageBase','newGarageGatesHint'])
        hintVideo = 'https://www.youtube.com/'
        break

      case (!contains(hash, 'clients') && contains(hash, 'users') && contains(hash, 'invite')):
        breadcrumbs.push({label: t(['pageBase','Users']), route: `/${garage}/admin/users`})
        breadcrumbs.push({label: t(['pageBase','inviteUser']), route: `/${garage}/admin/users/invite`})
        secondarySelected = 'users'
        hint = t(['pageBase','inviteUsersHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (!contains(hash, 'clients') && contains(hash, 'users')):
        breadcrumbs.push({label: t(['pageBase','Users']), route: `/${garage}/admin/users`})
        secondarySelected = 'users'
        hint = t(['pageBase','usersHint'])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'finance') && contains(hash, 'paypal')):
        breadcrumbs.push({label: t(['pageBase','Finance']), route: `/${garage}/admin/finance`})
        breadcrumbs.push({label: 'Paypal', route: `/${garage}/admin/finance/paypal`})
        secondarySelected = 'finance'
        hint = t(['pageBase','financePaypalHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'finance') && contains(hash, 'csob')):
        breadcrumbs.push({label: t(['pageBase','Finance']), route: `/${garage}/admin/finance`})
        breadcrumbs.push({label: 'ČSOB', route: `/${garage}/admin/finance/csob`})
        secondarySelected = 'finance'
        hint = t(['pageBase','financeCSOBHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'finance')):
        breadcrumbs.push({label: t(['pageBase','Finance']), route: `/${garage}/admin/finance`})
        secondarySelected = 'finance'
        hint = t(['pageBase','financeHint'])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'pidSettings')):
        breadcrumbs.push({label: t(['pageBase','PID settings']), route: `/${garage}/admin/pidSettings`})
        secondarySelected = 'PID'
        hint = t(['pageBase','pidSettingsHint'])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'activityLog')):
        breadcrumbs.push({label: t(['pageBase','Activity log']), route: `/${garage}/admin/activityLog`})
        secondarySelected = 'activity'
        hint = t(['pageBase','activityLogHint'])
        hintVideo = 'https://www.youtube.com/'
        break
    }

    dispatch(setAll('admin', dispatch(prepareAdminSecondaryMenu()), secondarySelected, breadcrumbs, hint, hintVideo))
  }
}

export function toAddFeatures() {
  return (dispatch, getState) => {
    dispatch(setAll(undefined, [], undefined, [{label: t(['pageBase','Add Features']), route: '/addFeatures'}], t(['pageBase','addFeaturesHint']), 'https://www.youtube.com/'))
  }
}

export function toProfile() {
  return (dispatch, getState) => {
    const hash = window.location.hash
    let breadcrumbs = [{label: t(['pageBase','Profile']), route: '/profile'}]
    // let secondarySelected = undefined
    // let hint = undefined
    // let hintVideo = undefined

    switch (true) { // MainMenu
      case (contains(hash, 'cars') && contains(hash, 'users')):
        breadcrumbs.push({label: t(['pageBase','Cars']), route: `/profile`})
        breadcrumbs.push({label: t(['pageBase','Users']), route: `/Profile`})
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','carUsersHint']), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'cars') && contains(hash, 'newCar')):
        breadcrumbs.push({label: t(['pageBase','Cars']), route: `/profile`})
        breadcrumbs.push({label: t(['pageBase','newCar']), route: `/Profile`})
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','newCarHint']), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'cars') && contains(hash, 'edit')):
        breadcrumbs.push({label: t(['pageBase','Cars']), route: `/profile`})
        breadcrumbs.push({label: t(['pageBase','editCar']), route: `/Profile`})
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','editCarHint']), 'https://www.youtube.com/'))
        break
      default:
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','settingsHint']), 'https://www.youtube.com/'))
        break
    }

  }
}

export function toNotifications() {
  return (dispatch, getState) => {
    dispatch(setAll(undefined, [], undefined, [{label: t(['pageBase','notifications']), route: '/notifications'}], t(['pageBase','notificationsHint']), 'https://www.youtube.com/'))
  }
}

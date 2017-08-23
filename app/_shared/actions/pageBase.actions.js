import * as nav    from '../helpers/navigation'
import { request } from '../helpers/request'
import {t}         from '../modules/localization/localization'

import { GET_CURRENT_USER, UPDATE_CURRENT_USER, GET_GARAGES } from '../queries/pageBase.queries'

export const PAGE_BASE_SELECTED                       = 'PAGE_BASE_SELECTED'
export const PAGE_BASE_SECONDARY_MENU                 = 'PAGE_BASE_SECONDARY_MENU'
export const PAGE_BASE_SECONDARY_MENU_SELECTED        = 'PAGE_BASE_SECONDARY_MENU_SELECTED'
export const PAGE_BASE_SHOW_SECONDARY_MENU            = 'PAGE_BASE_SHOW_SECONDARY_MENU'
export const PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON = 'PAGE_BASE_SET_SECONDARY_MENU_BACK_BUTTON'
export const PAGE_BASE_BREADCRUMBS                    = 'PAGE_BASE_BREADCRUMBS'
export const PAGE_BASE_SET_ERROR                      = 'PAGE_BASE_SET_ERROR'
export const PAGE_BASE_SET_SUCCESS                    = 'PAGE_BASE_SET_SUCCESS'
export const PAGE_BASE_SET_CUSTOM_MODAL               = 'PAGE_BASE_SET_CUSTOM_MODAL'
export const PAGE_BASE_SET_NOTIFICATIONS_MODAL        = 'PAGE_BASE_SET_NOTIFICATIONS_MODAL'
export const PAGE_BASE_SET_CURRENT_USER               = 'PAGE_BASE_SET_CURRENT_USER'
export const PAGE_BASE_SET_HINT                       = 'PAGE_BASE_SET_HINT'
export const PAGE_BASE_SET_GARAGES                    = 'PAGE_BASE_SET_GARAGES'
export const PAGE_BASE_SET_GARAGE                     = 'PAGE_BASE_SET_GARAGE'
export const PAGE_BASE_SET_PID_TARIF                  = 'PAGE_BASE_SET_PID_TARIF'
export const PAGE_BASE_SET_IS_GARAGE_ADMIN            = 'PAGE_BASE_SET_IS_GARAGE_ADMIN'
export const PAGE_BASE_SET_IS_GARAGE_RECEPTIONIST     = 'PAGE_BASE_SET_IS_GARAGE_RECEPTIONIST'
export const PAGE_BASE_SET_IS_GARAGE_SECURITY         = 'PAGE_BASE_SET_IS_GARAGE_SECURITY'


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

export function setSuccess(value) {
  return { type: PAGE_BASE_SET_SUCCESS
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

export function setGarages(value) {
  return (dispatch, getState) => {
    dispatch({ type: PAGE_BASE_SET_GARAGES
             , value
             })

    const selectedGarage = value.find(user_garage => user_garage.garage.id === getState().pageBase.garage)
    if(selectedGarage){
      dispatch(setGaragePidTarif(selectedGarage.garage.active_pid_tarif_id))
      dispatch(setIsGarageAdmin(selectedGarage.admin))
      dispatch(setIsGarageReceptionist(selectedGarage.receptionist))
      dispatch(setIsGarageSecurity(selectedGarage.security))
    }
  }
}

export function setGarage(value) {
  return (dispatch, getState) => {
    dispatch({ type: PAGE_BASE_SET_GARAGE
             , value
             })

    const selectedGarage = getState().pageBase.garages.find(user_garage => user_garage.garage.id === value)
    dispatch(setGaragePidTarif(selectedGarage ? selectedGarage.garage.active_pid_tarif_id : false))
    dispatch(setIsGarageAdmin(selectedGarage ? selectedGarage.admin : false))
    dispatch(setIsGarageReceptionist(selectedGarage ? selectedGarage.receptionist : false))
    dispatch(setIsGarageSecurity(selectedGarage ? selectedGarage.security : false))
  }
}

export function setIsGarageAdmin(value) {
  return (dispatch, getState) => {
    dispatch({ type: PAGE_BASE_SET_IS_GARAGE_ADMIN
             , value
             })

    // const hash = window.location.hash
    // if (contains(hash, 'admin')){
    //   dispatch(adminClick())
    // }
    // if (contains(hash, 'analytics')){
    //   dispatch(analyticsClick())
    // }
  }
}

export function setGaragePidTarif(value){
  return { type: PAGE_BASE_SET_PID_TARIF
         , value
         }
}

export function setIsGarageReceptionist(value) {
  return { type: PAGE_BASE_SET_IS_GARAGE_RECEPTIONIST
         , value
         }
}

export function setIsGarageSecurity(value) {
  return { type: PAGE_BASE_SET_IS_GARAGE_SECURITY
         , value
         }
}


function prepareAdminSecondaryMenu() {
  return (dispatch, getState) => {
    const garage = getState().pageBase.garage
    const state = getState().pageBase
    return [ {label: t(['pageBase', 'Invoices']),      key: "invoices", onClick: ()=>{nav.to(`/${garage}/admin/invoices`)} }
           , {label: t(['pageBase', 'Clients']),       key: "clients",  onClick: ()=>{nav.to(`/${garage}/admin/clients`)} }
           , state.isGarageAdmin && {label: t(['pageBase', 'Modules']),       key: "modules",     onClick: ()=>{nav.to(`/${garage}/admin/modules`)} }
           , state.isGarageAdmin && {label: t(['pageBase', 'Garage setup']),  key: "garageSetup", onClick: ()=>{nav.to(`/${garage}/admin/garageSetup/general`)} }
           , {label: t(['pageBase', 'Users']),         key: "users",    onClick: ()=>{nav.to(`/${garage}/admin/users`)} }
           , state.isGarageAdmin && {label: t(['pageBase', 'Finance']),       key: "finance",  onClick: ()=>{nav.to(`/${garage}/admin/finance`)} }
           , state.isGarageAdmin && {label: t(['pageBase', 'PID settings']),  key: "PID",      onClick: ()=>{nav.to(`/${garage}/admin/pidSettings`)} }
           , state.isGarageAdmin && {label: t(['pageBase', 'Activity log']),  key: "activity", onClick: ()=>{nav.to(`/${garage}/admin/activityLog`)} }
           ].filter(field => field !== false)
  }
}

function prepareAnalyticsSecondaryMenu() {
  return (dispatch, getState) => {
    const garage = getState().pageBase.garage
    const state = getState().pageBase
    return [ state.isGarageAdmin && {label: t(['pageBase', 'garageTurnover']), key: "garageTurnover",         onClick: ()=>{nav.to(`/${garage}/analytics/garageTurnover`)} }
           , state.isGarageAdmin && {label: t(['pageBase', 'reservations']),   key: "reservationsAnalytics",  onClick: ()=>{nav.to(`/${garage}/analytics/reservationsAnalytics`)} }
           , state.isGarageAdmin && {label: t(['pageBase', 'places']),         key: "placesAnalytics",        onClick: ()=>{nav.to(`/${garage}/analytics/placesAnalytics`)} }
          //  , state.isGarageAdmin && {label: t(['pageBase', 'payments']),       key: "paymentsAnalytics",      onClick: ()=>{nav.to(`/${garage}/analytics/paymentsAnalytics`)} }
          //  , state.isGarageAdmin && {label: t(['pageBase', 'gates']),          key: "gatesAnalytics",         onClick: ()=>{nav.to(`/${garage}/analytics/gatesAnalytics`)} }
           ].filter(field => field !== false)
  }
}

export function adminClick() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    const secondaryMenu = dispatch(prepareAdminSecondaryMenu())
    const wasAdminMenuSelected = secondaryMenu.map(o => o.key).includes(state.secondarySelected)

    dispatch(setSecondaryMenu(secondaryMenu))
    dispatch(setSecondaryMenuBackButton({label: `< ${t(['pageBase', 'Admin'])}`, onClick: ()=>{dispatch(setShowSecondaryMenu(false))}}))
    dispatch(setShowSecondaryMenu(!state.showSecondaryMenu || !wasAdminMenuSelected))
    if (!wasAdminMenuSelected){
      dispatch(setSecondaryMenuSelected('invoices'))
      nav.to(`/${state.garage}/admin/invoices`)
    }
  }
}

export function analyticsClick() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    const secondaryMenu = dispatch(prepareAnalyticsSecondaryMenu())
    const wasAnalyticsMenuSelected = secondaryMenu.map(o => o.key).includes(state.secondarySelected)

    dispatch(setSecondaryMenu(secondaryMenu))
    dispatch(setSecondaryMenuBackButton({label: `< ${t(['pageBase', 'analytics'])}`, onClick: ()=>{dispatch(setShowSecondaryMenu(false))}}))
    dispatch(setShowSecondaryMenu(!state.showSecondaryMenu || !wasAnalyticsMenuSelected)) // if was previously selected, then hide
    if (!wasAnalyticsMenuSelected){
      dispatch(setSecondaryMenuSelected('garageTurnover'))
      nav.to(`/${state.garage}/analytics/garageTurnover`)
    }
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

export function fetchGarages(){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      const user_garages = response.data.user_garages
        .filter(user_garage => user_garage.user_id === response.data.current_user.id) // find garages of current user
        .filter(user_garage => !user_garage.pending) // find only garages that are not pending

      dispatch( setGarages( user_garages ) )
      dispatch( setGarage( parseInt(window.location.hash.substring(5).split('/')[0]) || undefined ) ) // parse current garage from  URL

      if (user_garages.length > 0 && (getState().pageBase.garage === undefined || user_garages.find(user_garage => user_garage.garage.id === getState().pageBase.garage) === undefined)) {
        nav.to('/dashboard') // if no garage available from URL, select first and redirect to dashboard
        user_garages.length > 0 && dispatch( setGarage( user_garages[0].garage.id ))
      }
    }
    request(onSuccess, GET_GARAGES)
  }
}


export function initialPageBase () {
  return (dispatch, getState) => {
    const hash = window.location.hash

    if (!contains(hash, 'admin') && !contains(hash, 'analytics')){
      dispatch(setShowSecondaryMenu(false))
    }

    switch (true) { // MainMenu
      case contains(hash, 'dashboard'):
        dispatch(toDashboard())
        break;
      case (contains(hash, 'reservations') && !contains(hash, 'analytics')):
        dispatch(toReservations())
        break;
      case contains(hash, 'occupancy'):
        dispatch(toOccupancy())
        break;
      case (contains(hash, 'garage') && !contains(hash, 'admin') && !contains(hash, 'garageSetup') && !contains(hash, 'analytics')):
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

    if (getState().pageBase.current_user == undefined){ // if no information about current user
      dispatch(fetchCurrentUser())
    }
    if (getState().pageBase.garages.length === 0){ // if no garages
      dispatch(fetchGarages())
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
    let hint = t(['pageBase','reservationsHint'])

    switch (true) { // MainMenu
      case contains(hash, 'newReservation'):
        breadcrumbs.push({label: t(['pageBase','New Reservation']), route: '/reservations/newReservation'})
        hint = t(['pageBase','newReservationHint'])
        break

      case contains(hash, 'overview'):
        breadcrumbs.push({label: t(['newReservationOverview','overview']), route: '/reservations/newReservation/overview'})
        hint = t(['pageBase','reservationOverviewHint'])
        break
      }

    dispatch(setAll('reservations', [], undefined, breadcrumbs, hint, 'https://www.youtube.com/'))
  }
}

export function toOccupancy() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    if (state.isGarageAdmin || state.isGarageReceptionist || state.isGarageSecurity){
      dispatch(setAll('occupancy', [], undefined, [{label: t(['pageBase','Occupancy']), route: '/occupancy'}], t(['pageBase','OccupancyOverviewHint']), 'https://www.youtube.com/'))
    } else {
      nav.to('/dashboard')
    }
  }
}

export function toGarage() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    if (state.isGarageAdmin || state.isGarageReceptionist || state.isGarageSecurity){
      dispatch(setAll('garage', [], undefined, [{label: t(['pageBase','Garage']), route: '/garage'}], t(['pageBase','garagesHint']), 'https://www.youtube.com/'))
    } else {
      nav.to('/dashboard')
    }
  }
}

export function toIssues() {
  return (dispatch, getState) => {
    dispatch(setAll('issues', [], undefined, [{label: t(['pageBase','Issues']), route: '/issues'}], t(['pageBase','issuesHint']), 'https://www.youtube.com/'))
  }
}

export function toAnalytics() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    if (state.isGarageAdmin && state.pid_tarif >= 2) {
      const hash = window.location.hash
      let secondarySelected = undefined
      let hint = undefined
      let hintVideo = undefined


      switch (true) { // MainMenu
        case contains(hash, 'garageTurnover'):
        secondarySelected = 'garageTurnover'
        hint = t(['pageBase','analyticsGarageTurnoverHint'])
        hintVideo = 'https://www.youtube.com/'
        break

        case contains(hash, 'reservationsAnalytics'):
        secondarySelected = 'reservationsAnalytics'
        hint = t(['pageBase','analyticsreservationsHint'])
        hintVideo = 'https://www.youtube.com/'
        break

        case contains(hash, 'placesAnalytics'):
        secondarySelected = 'placesAnalytics'
        hint = t(['pageBase','analyticsplacesHint'])
        hintVideo = 'https://www.youtube.com/'
        break

        case contains(hash, 'paymentsAnalytics'):
        secondarySelected = 'paymentsAnalytics'
        hint = t(['pageBase','analyticspaymentsHint'])
        hintVideo = 'https://www.youtube.com/'
        break

        case contains(hash, 'gatesAnalytics'):
        secondarySelected = 'gatesAnalytics'
        hint = t(['pageBase','analyticsgatesHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      }

      dispatch(setAll('analytics', dispatch(prepareAnalyticsSecondaryMenu()), secondarySelected, undefined, hint, hintVideo))
    } else {
      nav.to('/dashboard') // not accessible for this user
    }
  }
}

export function toAdmin() {
  return (dispatch, getState) => {
    const state = getState().pageBase
    const hash = window.location.hash
    const garage = getState().pageBase.garage
    let breadcrumbs = [{label: t(['pageBase','Admin']), route: `/${garage}/admin/invoices`}]
    let secondarySelected = undefined
    let hint = undefined
    let hintVideo = undefined

    switch (true) { // MainMenu
      case contains(hash, 'invoices') && contains(hash, 'edit'):
        breadcrumbs.push({label: t(['pageBase','Invoices']), route: `/${garage}/admin/invoices`})
        breadcrumbs.push({label: t(['pageBase','editInvoice']), route: `/${garage}/admin/invoices`})
        secondarySelected = 'invoices'
        hint = t(['pageBase','editInvoiceHint'])
        hintVideo = 'https://www.youtube.com/'
        break
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
      case (contains(hash, 'clients/') && contains(hash, 'edit') && !contains(hash, 'editContract')):
        breadcrumbs.push({label: t(['pageBase','Clients']), route: `/${garage}/admin/clients`})
        breadcrumbs.push({label: t(['pageBase','editClient']), route: `/${garage}/admin/clients/edit`})
        secondarySelected = 'clients'
        hint = t(['pageBase','editClientHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'clients/') && contains(hash, 'newContract')):
        breadcrumbs.push({label: t(['pageBase','Clients']), route: `/${garage}/admin/clients`})
        breadcrumbs.push({label: t(['pageBase','NewContract']), route: `/${garage}/admin/clients/newContract`})
        secondarySelected = 'clients'
        hint = t(['pageBase','newContractHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case (contains(hash, 'clients/') && contains(hash, 'editContract')):
        breadcrumbs.push({label: t(['pageBase','Clients']), route: `/${garage}/admin/clients`})
        breadcrumbs.push({label: t(['pageBase','EditContract']), route: `/${garage}/admin/clients/editContract`})
        secondarySelected = 'clients'
        hint = t(['pageBase','editContractHint'])
        hintVideo = 'https://www.youtube.com/'
        break
      case contains(hash, 'clients'):
        breadcrumbs.push({label: t(['pageBase','Clients']), route: `/${garage}/admin/clients`})
        secondarySelected = 'clients'
        hint = t(['pageBase','clientsHint'])
        hintVideo = 'https://www.youtube.com/'
        break

      case (contains(hash, 'modules/') && contains(hash, 'marketingSettings')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
          breadcrumbs.push({label: t(['pageBase','marketingSettings']), route: `/${garage}/admin/modules/marketingSettings`})
          secondarySelected = 'modules'
          hint = t(['pageBase','garageNewMarketingHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'modules/') && contains(hash, 'reservationButton')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
          breadcrumbs.push({label: t(['pageBase','reservationButton']), route: `/${garage}/admin/modules/reservationButton`})
          secondarySelected = 'modules'
          hint = t(['pageBase','ReservationButtonHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'modules/') && contains(hash, 'mrParkitIntegration')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
          breadcrumbs.push({label: t(['pageBase','mrParkitIntegration']), route: `/${garage}/admin/modules/mrParkitIntegration`})
          secondarySelected = 'modules'
          hint = t(['pageBase','mrParkitIntegrationHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'modules/') && contains(hash, 'goPublic')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
          breadcrumbs.push({label: t(['pageBase','goPublic']), route: `/${garage}/admin/modules/goPublic`})
          secondarySelected = 'modules'
          hint = t(['pageBase','goPublicHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'modules')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Modules']), route: `/${garage}/admin/modules`})
          secondarySelected = 'modules'
          hint = t(['pageBase','garageMarketingHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break

      case (contains(hash, 'garageSetup') && contains(hash, 'general')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Garage setup']), route: `/${garage}/admin/garageSetup/general`})
          secondarySelected = 'garageSetup'
          hint = t(['pageBase','newGarageHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'floors')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','garageSetupFloors']), route: `/${garage}/admin/garageSetup/floors`})
          secondarySelected = 'garageSetup'
          hint = t(['pageBase','newGarageFloorsHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'gates')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','garageSetupGates']), route: `/${garage}/admin/garageSetup/gates`})
          secondarySelected = 'garageSetup'
          hint = t(['pageBase','newGarageGatesHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'order')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','garageSetupOrder']), route: `/${garage}/admin/garageSetup/gates`})
          secondarySelected = 'garageSetup'
          hint = t(['pageBase','newGarageOrderHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'subscribtion')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','garageSetupSubscribtion']), route: `/${garage}/admin/garageSetup/gates`})
          secondarySelected = 'garageSetup'
          hint = t(['pageBase','newGarageSubscribtionHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'users')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','garageSetupSubscribtion']), route: `/${garage}/admin/garageSetup/gates`})
          secondarySelected = 'garageSetup'
          hint = t(['pageBase','garageGarageUsersHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break

      case (!contains(hash, 'clients') && !contains(hash, 'garageSetup') && contains(hash, 'users') && contains(hash, 'invite')):
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
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Finance']), route: `/${garage}/admin/finance`})
          breadcrumbs.push({label: 'Paypal', route: `/${garage}/admin/finance/paypal`})
          secondarySelected = 'finance'
          hint = t(['pageBase','financePaypalHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'finance') && contains(hash, 'csob')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Finance']), route: `/${garage}/admin/finance`})
          breadcrumbs.push({label: 'ČSOB', route: `/${garage}/admin/finance/csob`})
          secondarySelected = 'finance'
          hint = t(['pageBase','financeCSOBHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'finance') && contains(hash, 'newRent')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Finance']), route: `/${garage}/admin/finance`})
          breadcrumbs.push({label: 'New rent', route: `/${garage}/admin/finance/newRent`})
          secondarySelected = 'finance'
          hint = t(['pageBase','garageNewRentHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'finance') && contains(hash, 'editRent')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Finance']), route: `/${garage}/admin/finance`})
          breadcrumbs.push({label: 'Edit rent', route: `/${garage}/admin/finance/newRent`})
          secondarySelected = 'finance'
          hint = t(['pageBase','garageEditRentHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
      case (contains(hash, 'finance')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Finance']), route: `/${garage}/admin/finance`})
          secondarySelected = 'finance'
          hint = t(['pageBase','financeHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break

      case (contains(hash, 'pidSettings')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','PID settings']), route: `/${garage}/admin/pidSettings`})
          secondarySelected = 'PID'
          hint = t(['pageBase','pidSettingsHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break

      case (contains(hash, 'activityLog')):
        if (state.isGarageAdmin) {
          breadcrumbs.push({label: t(['pageBase','Activity log']), route: `/${garage}/admin/activityLog`})
          secondarySelected = 'activity'
          hint = t(['pageBase','activityLogHint'])
          hintVideo = 'https://www.youtube.com/'
        } else {
          nav.to('/dashboard') // not accessible for this user
        }
        break
    }

    dispatch(setAll('admin', dispatch(prepareAdminSecondaryMenu()), secondarySelected, breadcrumbs, hint, hintVideo))
  }
}

export function toAddFeatures() {
  return (dispatch, getState) => {
    const hash = window.location.hash
    let breadcrumbs = [{label: t(['pageBase','Add Features']), route: '/addFeatures'}]

    switch (true) { // MainMenu
      case (contains(hash, 'gateModuleOrder')):
        breadcrumbs.push({label: t(['pageBase','Order gate module']), route: `/addFeatures/gateModuleOrder`})
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','orderGarageModuleHint']), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'general')):
        breadcrumbs.push({label: t(['pageBase','Garage setup']), route: `/addFeatures/garageSetup/general`})
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','newGarageHint']), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'floors')):
        breadcrumbs.push({label: t(['pageBase','garageSetupFloors']), route: `/addFeatures/garageSetup/floors`})
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','newGarageFloorsHint']), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'gates')):
        breadcrumbs.push({label: t(['pageBase','garageSetupGates']), route: `/addFeatures/garageSetup/gates`})
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','newGarageGatesHint']), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'order')):
        breadcrumbs.push({label: t(['pageBase','garageSetupOrder']), route: `/addFeatures/garageSetup/order`})
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','newGarageOrderHint']), 'https://www.youtube.com/'))
        break
      case (contains(hash, 'garageSetup') && contains(hash, 'subscribtion')):
        breadcrumbs.push({label: t(['pageBase','garageSetupSubscribtion']), route: `/addFeatures/garageSetup/subscribtion`})
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','newGarageSubscribtionHint']), 'https://www.youtube.com/'))
        break
      default:
        dispatch(setAll(undefined, [], undefined, breadcrumbs, t(['pageBase','addFeaturesHint']), 'https://www.youtube.com/'))
        break
    }
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

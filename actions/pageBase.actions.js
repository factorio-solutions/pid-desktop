import * as nav    from '../helpers/navigation'
import { request } from '../helpers/request'
import {t}         from '../modules/localization/localization'

export const SET_HORIZONTAL_CONTENT     = 'SET_VERTICAL_CONTENT'
export const SET_HORIZONTAL_SELECTED    = 'SET_HORIZONTAL_SELECTED'
export const SET_VERTICAL_SELECTED      = 'SET_VERTICAL_SELECTED'
export const PAGE_BASE_SET_ERROR        = 'PAGE_BASE_SET_ERROR'
export const PAGE_BASE_SET_CURRENT_USER = 'PAGE_BASE_SET_CURRENT_USER'
export const PAGE_BASE_SET_HINT         = 'PAGE_BASE_SET_HINT'
export const PAGE_BASE_SET_MENU_WIDTH   = 'PAGE_BASE_SET_MENU_WIDTH'

import { GET_CURRENT_USER, UPDATE_CURRENT_USER } from '../queries/pageBase.queries'

export function setHorizontalContent (content){
  return  { type: SET_HORIZONTAL_CONTENT
          , value: content
          }
}

export function setHorizontalSelected (index){
  return  { type: SET_HORIZONTAL_SELECTED
          , value: index
          }
}

export function setVerticalSelected (index){
  return  { type: SET_VERTICAL_SELECTED
          , value: index
          }
}

export function setError (error){
  return  { type: PAGE_BASE_SET_ERROR
          , value: error
          }
}

export function setCurrentUser (currentUser){
  return  { type: PAGE_BASE_SET_CURRENT_USER
          , value: currentUser
          }
}

export function setHint (hint){
  return  { type: PAGE_BASE_SET_HINT
          , value: hint
          }
}

export function setMenuWidth (menuWidth){
  return  { type: PAGE_BASE_SET_MENU_WIDTH
          , value: menuWidth
          }
}


export function fetchCurrentUser(){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setCurrentUser( response.data.current_user ) )
    }
    request(onSuccess, GET_CURRENT_USER)
  }
}

export function changeHints() {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setCurrentUser( response.data.update_user ) )
    }

    const current_user = getState().pageBase.current_user
    request(onSuccess, UPDATE_CURRENT_USER, {"user":{"hint": !current_user.hint},"id": current_user.id})
  }
}

export function initialPageBase () {
  return (dispatch, getState) => {
    var hash = window.location.hash

    switch (true) { // HorizontalMenus
      case contains(hash, 'notifications'):
        dispatch(toNotifications())
        break;
      case contains(hash, 'occupancy'):
        dispatch(toOccupancy())
        break;
      case contains(hash, 'reservations'):
        dispatch(toReservations())
        break;
      case contains(hash, 'garages'):
        dispatch(toGarages())
        break;
      case (contains(hash, 'clients') && !contains(hash, 'garages')):
        dispatch(toClients())
        break;
      case contains(hash, 'accounts'):
        dispatch(toAccounts())
        break;
      case contains(hash, 'cars'):
        dispatch(toCars())
        break;
      case contains(hash, 'addFeatures'):
        dispatch(toAddFeatures())
        break;
      case contains(hash, 'settings'):
        dispatch(toSettings())
        break;
      case contains(hash, 'users'):
        dispatch(toUsers())
        break;
    }

    switch (true) { // Hints
      case contains(hash, 'occupancy?'):
        dispatch(setHint(t(['pageBase', 'OccupancyOverviewHint'])))
        break;

      case contains(hash, 'addFeatures'):
        dispatch(setHint(t(['pageBase', 'addFeaturesHint'])))
        break;

      case contains(hash, 'overview'):
        dispatch(setHint(t(['pageBase', 'newReservationOverviewHint'])))
        break;
      case contains(hash, 'newReservation'):
        dispatch(setHint(t(['pageBase', 'newReservationHint'])))
        break;
      case contains(hash, 'reservations'):
        dispatch(setHint(t(['pageBase', 'reservationsHint'])))
        break;

      case contains(hash, 'garages/newGarage'):
        dispatch(setHint(t(['pageBase', 'newGarageHint'])))
        break;
      case contains(hash, 'newGarage'):
        dispatch(setHint(t(['pageBase', 'EditGarageHint'])))
        break;
      case contains(hash, 'garages') && contains(hash, 'clients'):
        dispatch(setHint(t(['pageBase', 'garageClientsHint'])))
        break;
      case contains(hash, 'garages') && contains(hash, 'marketing'):
        dispatch(setHint(t(['pageBase', 'garageMarketingHint'])))
        break;
      case contains(hash, 'garages') && contains(hash, 'newMarketing'):
        dispatch(setHint(t(['pageBase', 'garageNewMarketingHint'])))
        break;
      case contains(hash, 'marketing') && contains(hash, 'edit'):
        dispatch(setHint(t(['pageBase', 'garageEditMarketingHint'])))
        break;
      case contains(hash, 'garages') && contains(hash, 'newPricing'):
        dispatch(setHint(t(['pageBase', 'garageNewPricingHint'])))
        break;
      case contains(hash, 'pricings') && contains(hash, 'edit'):
        dispatch(setHint(t(['pageBase', 'garageEditPricingHint'])))
        break;
      case contains(hash, 'garages') && contains(hash, 'newRent'):
        dispatch(setHint(t(['pageBase', 'garageNewRentHint'])))
        break;
      case contains(hash, 'rents') && contains(hash, 'edit'):
        dispatch(setHint(t(['pageBase', 'garageEditRentHint'])))
        break;
      case contains(hash, 'garages') && contains(hash, 'addClient'):
        dispatch(setHint(t(['pageBase', 'garageAddClientHint'])))
        break;
      case contains(hash, 'garages') && contains(hash, 'users'):
        dispatch(setHint(t(['pageBase', 'garageGarageUsersHint'])))
        break;
      case contains(hash, 'garages?'):
        dispatch(setHint(t(['pageBase', 'garagesHint'])))
        break;

      case contains(hash, 'clients') && contains(hash, 'users'):
        dispatch(setHint(t(['pageBase', 'clientUsersHint'])))
        break;
      case contains(hash, 'clients') && contains(hash, 'newClient'):
        dispatch(setHint(t(['pageBase', 'newClientHint'])))
        break;
      case contains(hash, 'clients') && contains(hash, 'edit'):
        dispatch(setHint(t(['pageBase', 'editClientHint'])))
        break;
      case contains(hash, 'clients'):
        dispatch(setHint(t(['pageBase', 'clientsHint'])))
        break;

      case contains(hash, 'accounts') && contains(hash, 'newAccount'):
        dispatch(setHint(t(['pageBase', 'newAccountHint'])))
        break;
      case contains(hash, 'accounts') && contains(hash, 'edit'):
        dispatch(setHint(t(['pageBase', 'editAccountHint'])))
        break;
      case contains(hash, 'accounts'):
        dispatch(setHint(t(['pageBase', 'accountsHint'])))
        break;

      case contains(hash, 'cars') && contains(hash, 'users'):
        dispatch(setHint(t(['pageBase', 'carUsersHint'])))
        break;
      case contains(hash, 'cars') && contains(hash, 'newClient'):
        dispatch(setHint(t(['pageBase', 'newCarHint'])))
        break;
      case contains(hash, 'cars') && contains(hash, 'edit'):
        dispatch(setHint(t(['pageBase', 'editCarHint'])))
        break;
      case contains(hash, 'cars'):
        dispatch(setHint(t(['pageBase', 'carsHint'])))
        break;

      case contains(hash, 'users') && contains(hash, 'inviteUser'):
        dispatch(setHint(t(['pageBase', 'newClientUsersHint'])))
        break;
      case contains(hash, 'users'):
        dispatch(setHint(t(['pageBase', 'usersHint'])))
        break;

      case contains(hash, 'settings'):
        dispatch(setHint(t(['pageBase', 'settingsHint'])))
        break;
      case contains(hash, 'notifications'):
        dispatch(setHint(t(['pageBase', 'notificationsHint'])))
        break;
      default:
        dispatch(setHint(undefined))
        dispatch(setHint('NO HINT FOUND'))
    }

    // if (getState().pageBase.current_user == undefined){ // if no information about current user
    // }
    dispatch(fetchCurrentUser())
  }
}


function contains (string, text) {
  return string.indexOf(text) != -1
}

export function toNotifications(){
  return (dispatch, getState) => {
    dispatch(setVerticalSelected('notifications'))
    dispatch(setHorizontalSelected(0))
    dispatch(setHorizontalContent([{content: t(['pageBase', 'notifications']),  state: 'selected'}]))
  }
}

export function toOccupancy() {
  return (dispatch, getState) => {
    dispatch(setVerticalSelected('Occupancy'))
    dispatch(setHorizontalSelected(0))
    dispatch(setHorizontalContent([{content: t(['pageBase', 'OccupancyOverview']),  state: 'selected'}]))
  }
}

export function toReservations(){
  return (dispatch, getState) => {
    dispatch(setVerticalSelected('Reservation'))
    dispatch(setHorizontalSelected(contains(window.location.hash, 'newReservation')? 1 : 0))

    if (getState().pageBase.horizontalSelected == 0) {
      dispatch(setHorizontalContent([ {content: t(['pageBase', 'Reservations']), state: 'selected'}]))
    } else {
      dispatch(setHorizontalContent(
                      [ {content: t(['pageBase', 'Reservations']), state: 'disabled'}
                      , {content: '>',  state: 'disabled'}
                      , {content: t(['pageBase', 'New Reservation']),  state: 'selected'}
                      ]))
    }
  }
}

export function toGarages(){
  return (dispatch, getState) => {
    dispatch(setVerticalSelected('Garages'))
    dispatch(setHorizontalSelected(contains(window.location.hash, 'garages?') ? 0 : 1))

    if (getState().pageBase.horizontalSelected == 0) {
      dispatch(setHorizontalContent([ {content: t(['pageBase', 'Garages']), state: 'selected'}]))
    } else {
      switch (true) { // HorizontalMenus
        case contains(window.location.hash, 'garages/newGarage'):
          dispatch(setHorizontalContent(
            [ {content: t(['pageBase', 'Garages']), state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'NewGarage']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'newGarage'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().newGarage.name!="" ? "("+getState().newGarage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'EditGarage']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'clients'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().garageClients.garage ? "("+getState().garageClients.garage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'Clients']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'users'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().garageUsers.garage ? "("+getState().garageUsers.garage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'Users']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'newPricing'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().garageUsers.garage ? "("+getState().garageUsers.garage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'newPricing']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'pricings'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().garageUsers.garage ? "("+getState().garageUsers.garage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'Pricings']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'newRent'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().garageUsers.garage ? "("+getState().garageUsers.garage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'newRent']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'rents'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().garageUsers.garage ? "("+getState().garageUsers.garage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'Rents']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'marketing') && contains(window.location.hash, 'newMarketing'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().newMarketing.garage ? "("+getState().newMarketing.garage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'newMarketing']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'marketing') && contains(window.location.hash, 'edit'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().newMarketing.garage ? "("+getState().newMarketing.garage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'editMarketing']),  state: 'selected'}
          ]))
          break;
        case contains(window.location.hash, 'marketing'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Garages'])} ${getState().garageMarketing.garage ? "("+getState().garageMarketing.garage.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'marketing']),  state: 'selected'}
          ]))
          break;
      }
    }
  }
}

export function toClients(){
  return (dispatch, getState) => {
    dispatch(setVerticalSelected('Client & Users'))
    dispatch(setHorizontalSelected(contains(window.location.hash, 'clients/')? 1 : 0))

    if (getState().pageBase.horizontalSelected == 0) {
      dispatch(setHorizontalContent([ {content: t(['pageBase', 'Client & Users']), state: 'selected'}]))
    }
    else {
      switch (true) { // HorizontalMenus
        case contains(window.location.hash, 'clients') && contains(window.location.hash, 'users'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'Client & Users'])} ${getState().clientUsers.client.name ? "("+getState().clientUsers.client.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'Users']),  state: 'selected'}
            ]))
          break;
        case contains(window.location.hash, 'clients/newClient'):
          dispatch(setHorizontalContent(
             [ {content: `${t(['pageBase', 'Client & Users'])}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'NewClient']),  state: 'selected'}
            ]))
          break
        case contains(window.location.hash, 'clients') && contains(window.location.hash, 'edit'):
          dispatch(setHorizontalContent(
             [ {content: `${t(['pageBase', 'Client & Users'])}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'EditClient']),  state: 'selected'}
            ]))
          break
        case contains(window.location.hash, 'clients') && contains(window.location.hash, 'invoices'):
          dispatch(setHorizontalContent(
             [ {content: `${t(['pageBase', 'Client & Users'])} ${getState().invoices.client ? "("+getState().invoices.client.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'Invoices']),  state: 'selected'}
            ]))
          break
      }
    }
  }
}

export function toAccounts () {
  return (dispatch, getState) => {
    dispatch(setVerticalSelected('accounts'))
    dispatch(setHorizontalSelected(contains(window.location.hash, 'accounts/')? 1 : 0))

    if (getState().pageBase.horizontalSelected == 0) {
      dispatch(setHorizontalContent([ {content: t(['pageBase', 'accounts']), state: 'selected'}]))
    }
    else {
      switch (true) { // HorizontalMenus
        case contains(window.location.hash, 'accounts/newAccount'):
          dispatch(setHorizontalContent(
             [ {content: `${t(['pageBase', 'accounts'])}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'newAccount']),  state: 'selected'}
            ]))
          break
        case contains(window.location.hash, 'accounts') && contains(window.location.hash, 'edit'):
          dispatch(setHorizontalContent(
             [ {content: `${t(['pageBase', 'accounts'])}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'editAccount']),  state: 'selected'}
            ]))
          break
        case contains(window.location.hash, 'accounts') && contains(window.location.hash, 'invoices'):
          dispatch(setHorizontalContent(
             [ {content: `${t(['pageBase', 'accounts'])} ${getState().invoices.account ? "("+getState().invoices.account.name+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'Invoices']),  state: 'selected'}
            ]))
          break
      }
    }
  }
}

export function toUsers(){
  return (dispatch, getState) => {
    dispatch(setVerticalSelected('Users'))
    dispatch(setHorizontalSelected(contains(window.location.hash, 'inviteUser')? 1 : 0))

    if (getState().pageBase.horizontalSelected == 0) {
      dispatch(setHorizontalContent([ {content: t(['pageBase', 'allKnownUsers']), state: 'selected'}]))
    } else {
      dispatch(setHorizontalContent(
        [ {content: t(['pageBase', 'allKnownUsers']), state: 'disabled'}
        , {content: '>',  state: 'disabled'}
        , {content: t(['pageBase', 'inviteUser']),  state: 'selected'}
        ])
      )
    }
  }
}

export function toCars () {
  return (dispatch, getState) => {
    dispatch(setVerticalSelected('Cars'))
    dispatch(setHorizontalSelected(contains(window.location.hash, 'cars/')? 1 : 0))

    if (getState().pageBase.horizontalSelected == 0) {
      dispatch(setHorizontalContent([ {content: t(['pageBase', 'cars']), state: 'selected'}]))
    }
    else {
      switch (true) { // HorizontalMenus
        case contains(window.location.hash, 'cars') && contains(window.location.hash, 'users'):
          dispatch(setHorizontalContent(
            [ {content: `${t(['pageBase', 'cars'])} ${getState().carUsers.car.model ? "("+getState().carUsers.car.model+")" : ""}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'Users']),  state: 'selected'}
            ]))
          break;
        case contains(window.location.hash, 'cars/newCar'):
          dispatch(setHorizontalContent(
             [ {content: `${t(['pageBase', 'cars'])}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'newCar']),  state: 'selected'}
            ]))
          break
        case contains(window.location.hash, 'cars') && contains(window.location.hash, 'edit'):
          dispatch(setHorizontalContent(
             [ {content: `${t(['pageBase', 'cars'])}`, state: 'disabled'}
            , {content: '>',  state: 'disabled'}
            , {content: t(['pageBase', 'editCar']),  state: 'selected'}
            ]))
          break
      }
    }
  }
}

export function toAddFeatures () {
  return (dispatch, getState) => {
    dispatch(setVerticalSelected(undefined))
    dispatch(setHorizontalSelected(0))
    dispatch(setHorizontalContent([{content: t(['pageBase', 'addFeatures']),  state: 'selected'}]))
  }
}

export function toSettings () {
  return (dispatch, getState) => {
    dispatch(setVerticalSelected(undefined))
    dispatch(setHorizontalSelected(0))
    dispatch(setHorizontalContent([{content: t(['pageBase', 'Settings']),  state: 'selected'}]))
  }
}

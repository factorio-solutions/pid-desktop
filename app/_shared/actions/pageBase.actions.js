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

export function setHoriontalContent (content){
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
        case (contains(hash, 'accounts') && !contains(hash, 'garages')):
          dispatch(toAccounts())
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
        case contains(hash, 'garages') && contains(hash, 'accounts'):
          dispatch(setHint(t(['pageBase', 'garageAccountsHint'])))
          break;
        case contains(hash, 'garages?'):
          dispatch(setHint(t(['pageBase', 'garagesHint'])))
          break;

        case contains(hash, 'accounts') && contains(hash, 'users'):
          dispatch(setHint(t(['pageBase', 'accountUsersHint'])))
          break;
        case contains(hash, 'newAccount'):
          dispatch(setHint(t(['pageBase', 'newAccountHint'])))
          break;
        case contains(hash, 'accounts') && contains(hash, 'edit'):
          dispatch(setHint(t(['pageBase', 'editAccountHint'])))
          break;
        case contains(hash, 'accounts'):
          dispatch(setHint(t(['pageBase', 'accountsHint'])))
          break;

        case contains(hash, 'users') && contains(hash, 'inviteUser'):
          dispatch(setHint(t(['pageBase', 'newAccountUsersHint'])))
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
      }

      if (getState().pageBase.current_user == undefined){ // if no information about current user
        const onSuccess = (response) => {
          dispatch( setCurrentUser( response.data.current_user ) )
        }

        request(onSuccess, GET_CURRENT_USER)
      }
    }
}


function contains (string, text) {
  return string.indexOf(text) != -1
}

export function toOccupancy() {
  return (dispatch, getState) => {
    dispatch(setVerticalSelected(1))
    dispatch(setHorizontalSelected(0))
    dispatch(setHoriontalContent([{content: t(['pageBase', 'OccupancyOverview']),  state: 'selected'}]))
  }
}

export function toReservations(){
      return (dispatch, getState) => {
        dispatch(setVerticalSelected(2))
        dispatch(setHorizontalSelected(contains(window.location.hash, 'newReservation')? 1 : 0))

        if (getState().pageBase.horizontalSelected == 0) {
          dispatch(setHoriontalContent([ {content: t(['pageBase', 'Reservations']), state: 'selected'}]))
        } else {
          dispatch(setHoriontalContent(
                          [ {content: t(['pageBase', 'Reservations']), state: 'disabled'}
                          , {content: '>',  state: 'disabled'}
                          , {content: t(['pageBase', 'New Reservation']),  state: 'selected'}
                          ]))
        }
      }
}

export function toGarages(){
      return (dispatch, getState) => {
        dispatch(setVerticalSelected(3))
        dispatch(setHorizontalSelected(contains(window.location.hash, 'garages?') ? 0 : 1))

        if (getState().pageBase.horizontalSelected == 0) {
          dispatch(setHoriontalContent([ {content: t(['pageBase', 'Garages']), state: 'selected'}]))
        } else {
          switch (true) { // HorizontalMenus
            // case contains(window.location.hash, 'garage?'):
            //   dispatch(setHoriontalContent(
            //     [ {content: `${t(['pageBase', 'Garages'])} ${getState().garage.garage ? "("+getState().garage.garage.name+")" : ""}`, state: 'disabled'}
            //     , {content: '>',  state: 'disabled'}
            //     , {content: t(['pageBase', 'OccupancyOverview']),  state: 'selected'}
            //   ]))
            //   break;
            case contains(window.location.hash, 'garages/newGarage'):
              dispatch(setHoriontalContent(
                [ {content: t(['pageBase', 'Garages']), state: 'disabled'}
                , {content: '>',  state: 'disabled'}
                , {content: t(['pageBase', 'NewGarage']),  state: 'selected'}
              ]))
              break;
            case contains(window.location.hash, 'newGarage'):
              dispatch(setHoriontalContent(
                [ {content: `${t(['pageBase', 'Garages'])} ${getState().newGarage.name!="" ? "("+getState().newGarage.name+")" : ""}`, state: 'disabled'}
                , {content: '>',  state: 'disabled'}
                , {content: t(['pageBase', 'EditGarage']),  state: 'selected'}
              ]))
              break;
            case contains(window.location.hash, 'accounts'):
              dispatch(setHoriontalContent(
                [ {content: `${t(['pageBase', 'Garages'])} ${getState().garageAccounts.garage ? "("+getState().garageAccounts.garage.name+")" : ""}`, state: 'disabled'}
                , {content: '>',  state: 'disabled'}
                , {content: t(['pageBase', 'Accounts']),  state: 'selected'}
              ]))
              break;
          }
        }
      }
}

export function toAccounts(){
      return (dispatch, getState) => {
        dispatch(setVerticalSelected(4))
        dispatch(setHorizontalSelected(contains(window.location.hash, 'users')? 1 : 0))

        if (getState().pageBase.horizontalSelected == 0) {
          dispatch(setHoriontalContent([ {content: t(['pageBase', 'Account & Users']), state: 'selected'}]))
        }
        else {
          dispatch(setHoriontalContent(
                          [ {content: `${t(['pageBase', 'Account & Users'])} ${getState().accountUsers.account.name ? "("+getState().accountUsers.account.name+")" : ""}`, state: 'disabled'}
                          , {content: '>',  state: 'disabled'}
                          , {content: t(['pageBase', 'Users']),  state: 'selected'}
                          ]))
        }
      }
}

export function toUsers(){
  return (dispatch, getState) => {
    dispatch(setVerticalSelected(5))
    dispatch(setHorizontalSelected(contains(window.location.hash, 'inviteUser')? 1 : 0))

    if (getState().pageBase.horizontalSelected == 0) {
      dispatch(setHoriontalContent([ {content: t(['pageBase', 'allKnownUsers']), state: 'selected'}]))
    } else {
      dispatch(setHoriontalContent(
        [ {content: t(['pageBase', 'allKnownUsers']), state: 'disabled'}
        , {content: '>',  state: 'disabled'}
        , {content: t(['pageBase', 'inviteUser']),  state: 'selected'}
        ])
      )
    }
  }
}

export function toNotifications(){
  return (dispatch, getState) => {
    dispatch(setVerticalSelected(0))
    dispatch(setHorizontalSelected(0))
    dispatch(setHoriontalContent([{content: t(['pageBase', 'notifications']),  state: 'selected'}]))
  }
}

export function toSettings () {
  return (dispatch, getState) => {
    dispatch(setVerticalSelected(undefined))
    dispatch(setHorizontalSelected(0))
    dispatch(setHoriontalContent([{content: t(['pageBase', 'Settings']),  state: 'selected'}]))
  }
}

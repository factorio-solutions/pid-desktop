import { request } from '../helpers/request'

import { GET_CURRENT_USER, GET_RESERVABLE_GARAGES } from '../queries/mobile.header.queries'

export const MOBILE_MENU_SET_GARAGES      = 'MOBILE_MENU_SET_GARAGES'
export const MOBILE_MENU_SET_GARAGE       = 'MOBILE_MENU_SET_GARAGE'
export const MOBILE_MENU_SET_CURRENT_USER = 'MOBILE_MENU_SET_CURRENT_USER'


export function resetStore () {
  return { type: 'RESET' }
}

export function setGarages (garages){
  return  { type: MOBILE_MENU_SET_GARAGES
          , value: garages
          }
}

export function setGarage (garage){
  return  { type: MOBILE_MENU_SET_GARAGE
          , value: garage
          }
}

export function setCurrentUser (currentUser){
  return  { type: MOBILE_MENU_SET_CURRENT_USER
          , value: currentUser
          }
}


export function initGarages (){
  return (dispatch, getState) => {
    const onGarageSuccess = (response) => {
      var garages = response.data.reservable_garages
      garages.unshift({id: undefined, name: "All garages"})
      dispatch( setGarages(garages) )
    }

    const onSuccess = (response) => {
      dispatch( setCurrentUser(response.data.current_user) )
      request(onGarageSuccess, GET_RESERVABLE_GARAGES, { user_id: response.data.current_user.id })
    }
    request(onSuccess, GET_CURRENT_USER)
  }
}

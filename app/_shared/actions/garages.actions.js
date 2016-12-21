import { request } from '../helpers/request'

import { GET_GARAGES, DESTROY_GARAGE } from '../queries/garages.queries'

export const SET_GARAGES            = "SET_GARAGES"
export const SET_GARAGES_TABLEVIEW  = "SET_GARAGES_TABLEVIEW"


export function setGarages (garages){
  return  { type: SET_GARAGES
          , value: garages
          }
}

export function setTableView (bool){
  return  { type: SET_GARAGES_TABLEVIEW
          , value: bool
          }
}


export function initGarages (){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setGarages(response.data.user_garages.map(function(user_garage){return user_garage.garage})) )
    }
    request(onSuccess, GET_GARAGES)
  }
}

export function destroyGarage (id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(initGarages())
    }
    request(onSuccess, DESTROY_GARAGE, {id: id})
  }
}

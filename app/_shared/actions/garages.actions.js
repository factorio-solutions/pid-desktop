import { request } from '../helpers/request'
<<<<<<< HEAD

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
=======
import _           from 'lodash'

import { GET_GARAGES, DESTROY_GARAGE } from '../queries/garages.queries'
import { fetchCurrentUser }            from './pageBase.actions'

export const GARAGES_SET_GARAGES            = "GARAGES_SET_GARAGES"
export const GARAGES_SET_PRICINGS           = "GARAGES_SET_PRICINGS"
export const GARAGES_SET_RENTS              = "GARAGES_SET_RENTS"
export const GARAGES_SET_GARAGES_TABLEVIEW  = "GARAGES_SET_GARAGES_TABLEVIEW"


export function setGarages (garages){
  return  { type: GARAGES_SET_GARAGES
          , value: garages
          }
}
export function setPricings (pricing){
  return  { type: GARAGES_SET_PRICINGS
          , value: pricing
          }
}
export function setRents (rents){
  return  { type: GARAGES_SET_RENTS
          , value: rents
          }
}

export function setTableView (bool){
  return  { type: GARAGES_SET_GARAGES_TABLEVIEW
>>>>>>> feature/new_api
          , value: bool
          }
}


export function initGarages (){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
<<<<<<< HEAD
      dispatch( setGarages(response.data.user_garages.map(function(user_garage){return user_garage.garage})) )
    }
    request(onSuccess, GET_GARAGES)
=======
      var uniqueGarages = _.uniqWith(response.data.user_garages.map(function (user_garage) {return user_garage.garage}),  _.isEqual)

      uniqueGarages.map((garage) => {
        garage.admin = response.data.user_garages.find((user_garage)=>{return user_garage.garage.id === garage.id && user_garage.user_id === response.data.current_user.id}).admin
        return garage
      })

      dispatch( setGarages(uniqueGarages) )
      dispatch( setPricings(response.data.pricings) )
      dispatch( setRents(response.data.rents) )
    }
    request(onSuccess, GET_GARAGES)
    dispatch(fetchCurrentUser())
>>>>>>> feature/new_api
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

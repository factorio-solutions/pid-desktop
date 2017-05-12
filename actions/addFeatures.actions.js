import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'

import { setTarif }   from './garageSetup.actions'
import { GET_TARIFS } from '../queries/addFeatures.queries'


export const ADD_FEATURES_SET_TARIFS = "ADD_FEATURES_SET_TARIFS"


export function setTarifs(value){
  return { type: ADD_FEATURES_SET_TARIFS
         , value
         }
}


export function initTarifs(){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setTarifs(response.data.tarifs))
    }

    request(onSuccess, GET_TARIFS)
  }
}

export function tarifSelected (id){
  return (dispatch, getState) => {
    dispatch(setTarif(id))
    nav.to('/addFeatures/garageSetup/general')
  }
}

import { request } from '../helpers/request'

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

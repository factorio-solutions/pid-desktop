import { request }    from '../helpers/request'
import * as nav       from '../helpers/navigation'
import { toGarages }  from './pageBase.actions'

import { GET_GARAGE_MARKETING, UPDATE_MARKETING } from '../queries/garageMarketing.queries'

export const GARAGE_MARKETING_SET_MARKETING = "GARAGE_MARKETING_SET_MARKETING"
export const GARAGE_MARKETING_SET_GARAGE    = "GARAGE_MARKETING_SET_GARAGE"


export function setMarketing (array){
  return  { type: GARAGE_MARKETING_SET_MARKETING
          , value: array
          }
}

export function setGarage (garage){
  return  { type: GARAGE_MARKETING_SET_GARAGE
          , value: garage
          }
}


export function initMarketing (garageId){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setGarage(response.data.garage))
      dispatch(toGarages())
      dispatch(setMarketing(response.data.marketing))
    }

    request(onSuccess, GET_GARAGE_MARKETING, {id: parseInt(garageId)} )
  }
}

export function runMarketing (id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(initMarketing (response.data.update_marketing.garage_id))
    }

    request(onSuccess, UPDATE_MARKETING, {id: id, "marketing": {"marketing_launched": true}} )
  }
}

export function stopMarketing (id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(initMarketing (response.data.update_marketing.garage_id))
    }

    request(onSuccess, UPDATE_MARKETING, {id: id, "marketing": {"marketing_launched": false}} )
  }
}

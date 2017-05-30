import moment      from 'moment'
import { request } from '../helpers/request'
import { t }       from '../modules/localization/localization'

import { GARAGE_DETAILS_QUERY } from '../queries/garage.queries.js'

export const GARAGE_SET_SELECTED      = 'GARAGE_SET_SELECTED'
export const GARAGE_SET_GARAGE        = 'GARAGE_SET_GARAGE'
export const GARAGE_SET_NOW           = 'GARAGE_SET_NOW'
export const GARAGE_SET_SHOW_SELECTOR = 'GARAGE_SET_SHOW_SELECTOR'
export const GARAGE_SET_TIME          = 'GARAGE_SET_TIME'

export function setSelected (value){
  return { type: GARAGE_SET_SELECTED
         , value
         }
}

export function setGarage (value){
  return { type: GARAGE_SET_GARAGE
         , value
         }
}

export function setNow (value){
  return { type: GARAGE_SET_NOW
         , value
         }
}

export function setSelector (value){
  return { type: GARAGE_SET_SHOW_SELECTOR
         , value
         }
}

export function setTime (value){
  return { type: GARAGE_SET_TIME
         , value
         }
}


export function setTimeToNow () {
  return (dispatch, getState) => {
    dispatch(setNow(true))
    dispatch(setTime(moment()))
  }
}

export function setTimeTo (time) {
  return (dispatch, getState) => {
    dispatch(setNow(false))
    dispatch(setTime(moment(time)))
  }
}

export function initGarage () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      console.log(response);
      dispatch(setGarage(response.data.garage))
    }

    getState().pageBase.garage && request(onSuccess, GARAGE_DETAILS_QUERY, {id: getState().pageBase.garage})
  }
}

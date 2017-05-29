import { request } from '../helpers/request'

import { GET_RENTS } from '../queries/admin.finance.queries'

import { fetchCurrentUser } from './pageBase.actions'


export const ADMIN_FINANCE_SET_RENTS = 'ADMIN_FINANCE_SET_RENTS'


export function setRents (rents){
  return  { type: ADMIN_FINANCE_SET_RENTS
          , value: rents
          }
}


export function initRents (){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch( setRents(response.data.rents) )
    }

    request(onSuccess, GET_RENTS)

    dispatch(fetchCurrentUser())
  }
}

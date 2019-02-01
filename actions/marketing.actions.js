import request    from '../helpers/request'

import { GET_GARAGE_MARKETING_DETAILS } from '../queries/marketing.queries'

export const MARKETING_SET_MARKETING = 'MARKETING_SET_MARKETING'


export function setMarketing (marketing){
  return { type: MARKETING_SET_MARKETING
         , value: marketing
         }
}

export function initMarketingPage (short_name, callback){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setMarketing(response.data.marketing[0]))
      callback()
    }

    request(onSuccess, GET_GARAGE_MARKETING_DETAILS, {short_name: short_name})
  }
}

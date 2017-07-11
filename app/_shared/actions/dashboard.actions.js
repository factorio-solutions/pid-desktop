import { request }  from '../helpers/request'
import { download } from '../helpers/download'
import { t }        from '../modules/localization/localization'
import * as nav     from '../helpers/navigation'

import { INIT_DASHBOARD } from '../queries/dashboard.queries'


export const DASHBOARD_SET_NEWS   = 'DASHBOARD_SET_NEWS'
export const DASHBOARD_SET_GARAGE = 'DASHBOARD_SET_GARAGE'
export const DASHBOARD_SET_LOGS   = 'DASHBOARD_SET_LOGS'


export function setNews (value) {
  return { type: DASHBOARD_SET_NEWS
         , value
         }
}

export function setGarage (value) {
  return { type: DASHBOARD_SET_GARAGE
         , value
         }
}

export function setLogs (value) {
  return { type: DASHBOARD_SET_LOGS
         , value
         }
}


export function initDashboard (id){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setNews(response.data.news))
    }

    request(onSuccess, INIT_DASHBOARD)
  }
}

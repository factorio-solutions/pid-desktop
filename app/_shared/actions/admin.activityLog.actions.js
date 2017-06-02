import { request } from '../helpers/request'

import { GET_LOGS } from '../queries/admin.activityLog.queries'


export const SET_ADMIN_ACTIVITY_LOGS_LOGS = 'SET_ADMIN_ACTIVITY_LOGS_LOGS'


export function setLogs(value){
  return { type: SET_ADMIN_ACTIVITY_LOGS_LOGS
         , value
         }
}


export function initLogs() {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setLogs(response.data.logs.map(log => ({...log, full_name: log.user.full_name, email: log.user.email}))))
    }

    request(onSuccess, GET_LOGS, {garage_id: getState().pageBase.garage})
  }
}

import request from '../helpers/requestAdmin'
import actionFactory from '../helpers/actionFactory'

import { GET_ADMIN_LOGS, GET_ADMIN_ACCESS_LOGS } from '../queries/pid-admin.logs.queries'


export const SET_PID_ADMIN_LOGS_LOGS = 'SET_PID_ADMIN_LOGS_LOGS'
export const SET_PID_ADMIN_LOGS_ACCESS_LOGS = 'SET_PID_ADMIN_LOGS_ACCESS_LOGS'

export const setLogs = actionFactory(SET_PID_ADMIN_LOGS_LOGS)
export const setAccessLogs = actionFactory(SET_PID_ADMIN_LOGS_ACCESS_LOGS)


export function initLogs() {
  return dispatch => {
    request(GET_ADMIN_LOGS)
    .then(data => dispatch(setLogs(data.logs)))
  }
}

export function initAccessLogs() {
  return dispatch => {
    request(GET_ADMIN_ACCESS_LOGS)
    .then(data => {
      dispatch(setAccessLogs(data.gate_access_logs.map(
        log => ({
          ...log,
          user: {
            ...log.user,
            used_phone: log.user_phone
          }
        })
      )))
    })
  }
}

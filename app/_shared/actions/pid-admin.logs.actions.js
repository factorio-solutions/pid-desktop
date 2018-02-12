import request from '../helpers/requestAdmin'
import actionFactory from '../helpers/actionFactory'

import { GET_ADMIN_LOGS } from '../queries/pid-admin.logs.queries'


export const SET_PID_ADMIN_LOGS_LOGS = 'SET_PID_ADMIN_LOGS_LOGS'

export const setLogs = actionFactory(SET_PID_ADMIN_LOGS_LOGS)


export function initLogs() {
  return dispatch => {
    request(GET_ADMIN_LOGS)
    .then(data => dispatch(setLogs(data.logs)))
  }
}
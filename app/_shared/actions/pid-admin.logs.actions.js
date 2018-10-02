import actionFactory from '../helpers/actionFactory'

export const SET_PID_ADMIN_LOGS_LOGS = 'SET_PID_ADMIN_LOGS_LOGS'
export const SET_PID_ADMIN_LOGS_ACCESS_LOGS = 'SET_PID_ADMIN_LOGS_ACCESS_LOGS'

export const setLogs = actionFactory(SET_PID_ADMIN_LOGS_LOGS)
export const setAccessLogs = actionFactory(SET_PID_ADMIN_LOGS_ACCESS_LOGS)

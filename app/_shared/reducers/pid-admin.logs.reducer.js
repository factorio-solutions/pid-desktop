import {
  SET_PID_ADMIN_LOGS_LOGS,
  SET_PID_ADMIN_LOGS_ACCESS_LOGS
}  from '../actions/pid-admin.logs.actions'

const defaultState = {
  logs:       undefined,
  accessLogs: []
}

export default function pidAdminLogs(state = defaultState, action) {
  switch (action.type) {

    case SET_PID_ADMIN_LOGS_LOGS:
      return {
        ...state,
        logs: action.value
      }

    case SET_PID_ADMIN_LOGS_ACCESS_LOGS:
      return {
        ...state,
        accessLogs: action.value
      }

    default:
      return state
  }
}

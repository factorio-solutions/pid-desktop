import { SET_PID_ADMIN_LOGS_LOGS }  from '../actions/pid-admin.logs.actions'

const defaultState = {
  logs: []
}

export default function pidAdminLogs(state = defaultState, action) {
  switch (action.type) {

    case SET_PID_ADMIN_LOGS_LOGS:
      return {
        ...state,
        logs: action.value
      }

    default:
      return state
  }
}

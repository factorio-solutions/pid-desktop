import { SET_ADMIN_ACTIVITY_LOGS_LOGS }  from '../actions/admin.activityLog.actions'

const defaultState = { logs: [] }


export default function adminActivityLog(state = defaultState, action) {
  switch (action.type) {

    case SET_ADMIN_ACTIVITY_LOGS_LOGS:
      return {
        ...state,
        logs: action.value
      }

    default:
      return state
  }
}

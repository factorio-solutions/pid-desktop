import {
  SET_ADMIN_ACTIVITY_LOGS_TABLE_STATE
} from '../actions/admin.activityLog.actions'

const defaultState = {
  tableState: undefined
}


export default function adminActivityLog(state = defaultState, action) {
  switch (action.type) {

    case SET_ADMIN_ACTIVITY_LOGS_TABLE_STATE:
      return {
        ...state,
        tableState: action.value
      }

    default:
      return state
  }
}

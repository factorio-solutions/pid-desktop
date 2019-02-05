import {
  PID_ADMIN_MOBILE_APP_VERSION_SET_VERSIONS
} from '../actions/pid-admin.mobileAppVersion.actions'

const defaultState = {
  versions: []
}

export default function pidAdminMobileAppVersion(state = defaultState, action) {
  switch (action.type) {
    case PID_ADMIN_MOBILE_APP_VERSION_SET_VERSIONS:
      return {
        ...state,
        versions: action.value
      }

    default:
      return state
  }
}

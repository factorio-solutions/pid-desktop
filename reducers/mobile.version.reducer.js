import {
  SET_CURRENT_VERSION,
  SET_APP_VERSION
} from '../actions/mobile.version.actions'

import { version } from '../../../package.json'

const defaultState = {
  appVersion:     version,
  currentVersion: { version: undefined, lastCheckAt: undefined }
}

export default function mobileVersion(state = defaultState, action) {
  switch (action.type) {
    case SET_APP_VERSION:
      return {
        ...state,
        appVersion: action.value
      }
    case SET_CURRENT_VERSION:
      return {
        ...state,
        currentVersion: action.value
      }

    default:
      return state
  }
}

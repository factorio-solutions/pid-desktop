import actionFactory from '../helpers/actionFactory'

import request from '../helpers/requestAdmin'

import {
  GET_ALL_MOBILE_APP_VERSIONS,
  UPDATE_ALL_MOBILE_APP_VERSIONS
} from '../queries/pid-admin.mobileAppVersion.queries'

export const PID_ADMIN_MOBILE_APP_VERSION_SET_VERSIONS = 'PID_ADMIN_MOBILE_APP_VERSION_SET_VERSIONS'
export const PID_ADMIN_MOBILE_APP_VERSION_SET_VERSION = 'PID_ADMIN_MOBILE_APP_VERSION_SET_VERSION'

export const setVersions = actionFactory(PID_ADMIN_MOBILE_APP_VERSION_SET_VERSIONS)

export function setAppVersion(value, id) {
  return (dispatch, getState) => {
    const { versions } = getState().pidAdminMobileAppVersion
    dispatch(setVersions(versions.map(version => {
      if (version.id !== id) {
        return version
      }

      return {
        ...version,
        version: value
      }
    })))
  }
}

export function downloadAllVersions() {
  return async dispatch => {
    const { mobile_app_all_versions: allVersions } = (
      await request(GET_ALL_MOBILE_APP_VERSIONS)
    )

    dispatch(setVersions(allVersions))
  }
}

export function uploadAllVersions() {
  return async (dispatch, getState) => {
    const { versions } = getState().pidAdminMobileAppVersion

    const { update_mobile_app_versions: allVersions } = (
      await request(
        UPDATE_ALL_MOBILE_APP_VERSIONS,
        { mobile_app_versions: versions }
      )
    )

    dispatch(setVersions(allVersions))
  }
}

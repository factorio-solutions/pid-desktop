import React from 'react'
import moment from 'moment'
import requestPromise from '../helpers/requestPromise'
import actionFactory from '../helpers/actionFactory'

import RoundButton from '../components/buttons/RoundButton'

import { GET_CURRENT_MOBILE_VERSION } from '../queries/mobile.header.queries'

import { setCustomModal } from './mobile.header.actions'
import { t } from '../modules/localization/localization';

export const SET_CURRENT_VERSION = 'SET_CURRENT_VERSION'
export const SET_APP_VERSION = 'SET_APP_VERSION'

export const setAppVersion = actionFactory(SET_APP_VERSION)

export function setCurrentVersion(currentVersion) {
  return dispatch => {
    dispatch({
      type:  SET_CURRENT_VERSION,
      value: {
        currentVersion,
        lastCheckAt: moment()
      }
    })
  }
}

export function getCurrentMobileVersion(platform) {
  return requestPromise(GET_CURRENT_MOBILE_VERSION, { platform })
}

export function showOlderVersionModal() {
  return dispatch => dispatch(setCustomModal(
    <div>
      <div>{t([ 'mobile', 'version', 'oldAppVersion' ])}</div>
      <RoundButton
        content={<span className="fa fa-check" aria-hidden="true" />}
        onClick={() => dispatch(setCustomModal())}
        type="confirm"
      />
    </div>
  ))
}

export function checkCurrentVersion() {
  return async (dispatch, getState) => {
    const { currentVersion, appVersion } = getState().mobileVersion
    const platform = (window.cordova && window.cordova.platformId) || 'android'
    if (
      !currentVersion.lastCheckAt
      || !moment(currentVersion.lastCheckAt).isSame(moment(), 'day')
    ) {
      const { mobile_app_version: mobileAppVersion } = await getCurrentMobileVersion(platform)

      dispatch(setCurrentVersion(mobileAppVersion))

      if (mobileAppVersion !== appVersion) {
        dispatch(showOlderVersionModal())
      }
    }
  }
}

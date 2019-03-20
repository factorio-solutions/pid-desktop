import React from 'react'
import moment from 'moment'
import requestPromise from '../helpers/requestPromise'
import actionFactory from '../helpers/actionFactory'

import RoundButton from '../components/buttons/RoundButton'

import { GET_CURRENT_MOBILE_VERSION } from '../queries/mobile.header.queries'

import { setCustomModal } from './mobile.header.actions'
import { t } from '../modules/localization/localization'

const IS_ANDROID = window.cordova && cordova.platformId === 'android'

export const SET_CURRENT_VERSION = 'SET_CURRENT_VERSION'
export const SET_APP_VERSION = 'SET_APP_VERSION'

export const setAppVersion = actionFactory(SET_APP_VERSION)

function setCurrentVersion(currentVersion) {
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

function getCurrentMobileVersion(platform) {
  return requestPromise(GET_CURRENT_MOBILE_VERSION, { platform })
}

export function showOlderVersionModal() {
  return dispatch => dispatch(setCustomModal(
    <div>
      <div>
        {t([ 'mobileApp', 'version', 'oldAppVersion' ])}
        <br />
        {window.cordova && (
          <img
            src={IS_ANDROID ? './public/google+play.png' : './public/apple+store.png'}
            alt={IS_ANDROID ? 'google play' : 'apple app store'}
            title={IS_ANDROID ? 'google play' : 'apple app store'}
            height="44"
            width="150"
            style={{ padding: '5px' }}
            onClick={() => {
              cordova.plugins.market.open(
                IS_ANDROID
                  ? 'com.parkitdirect.client'
                  : 'id1262918053',
                {
                  success: () => {
                    console.log('Market success.')
                    dispatch(setCustomModal())
                  },
                  error: () => {
                    console.log('Market error.')
                    dispatch(setCustomModal())
                  }
                }
              )
            }}
          />
        )}
      </div>
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

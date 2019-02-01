import request from '../helpers/request'
import { fetchGarages } from './pageBase.actions.js'
import { initGarages } from './mobile.header.actions.js'
import { mobile } from '../../index'

import { GET_NOTIFICATIONS_DETAILS, ACCEPT_NOTIFICATION, DECLINE_NOTIFICATION } from '../queries/notifications.queries'

export const SET_NOTIFICATIONS_DETAILS = 'SET_NOTIFICATIONS_DETAILS'
export const SET_NOTIFICATIONS_COUNT = 'SET_NOTIFICATIONS_COUNT'
export const SET_NOTIFICATIONS_PAST = 'SET_NOTIFICATIONS_PAST'


export function setNotifications(detailedNotifications) {
  return { type:  SET_NOTIFICATIONS_DETAILS,
    value: detailedNotifications
  }
}

export function setNotificationCount(count) {
  return { type:  SET_NOTIFICATIONS_COUNT,
    value: count
  }
}

export function setPast(past) {
  return dispatch => {
    dispatch({ type:  SET_NOTIFICATIONS_PAST,
      value: past
    })

    dispatch(initNotifications())
  }
}


export function initNotifications() {
  return (dispatch, getState) => {
    const onSuccess = response => {
      dispatch(setNotifications(response.data.notifications))
    }
    request(onSuccess, GET_NOTIFICATIONS_DETAILS, { past: getState().notifications.past })
  }
}

export function removeFromList(notification) {
  return (dispatch, getState) => {
    const notifications = getState().notifications.notifications
    const index = notifications.findIndexById(notification.id)

    if (index >= 0) {
      dispatch(setNotifications(
        [ ...notifications.slice(0, index),
          ...notifications.slice(index + 1)
        ]
      ))
    }
  }
}

export function accept(notification) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(initNotifications())
      if (mobile) {
        dispatch(initGarages())
      } else {
        dispatch(fetchGarages(false))
      }
    }

    request(onSuccess, ACCEPT_NOTIFICATION, { id: notification.id, notification: { confirmed: true } })
    dispatch(removeFromList(notification))
  }
}

export function decline(notification) {
  return dispatch => {
    const onSuccess = response => {
      dispatch(initNotifications())
    }

    request(onSuccess, DECLINE_NOTIFICATION, { id: notification.id, notification: { confirmed: false } })
    dispatch(removeFromList(notification))
  }
}

import React from 'react'
import moment from 'moment'

import RoundButton from '../components/buttons/RoundButton'

import { t }    from '../modules/localization/localization'
import { sendError } from '../../index'

import { setCustomModal } from '../actions/pageBase.actions'

import { GET_RECURRING_RESERVATION } from '../queries/newReservation.queries'
import requestPromise from './requestPromise'

async function isRecurringReservationComplete(id) {
  try {
    const res = await requestPromise(GET_RECURRING_RESERVATION, { id })

    const state = res.recurring_reservation && res.recurring_reservation.state

    return state === 'completed'
  } catch (error) {
    sendError(error)
    return false
  }
}

export default function waitToRecurringReservation(recurringReservationId) {
  const intervalDuration = 7000
  const maxWaitingTime = 120
  const startTime = moment()

  return new Promise(async (resolve, reject) => {
    const interval = setInterval(async () => {
      const completed = await isRecurringReservationComplete(recurringReservationId)

      if (completed) {
        clearInterval(interval)
        resolve(true)
      } else if (moment().diff(startTime, 'seconds') > maxWaitingTime) {
        clearInterval(interval)
        resolve(false)
      }
    },
    intervalDuration)
  })
}

export function showRecurringErrorModalAction() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch(setCustomModal(
        <div style={{ textAlign: 'center' }}>
          {t([ 'newReservation', 'recurringReservationError' ])}
          <br />
          <RoundButton
            content={<i className="fa fa-check" aria-hidden="true" />}
            onClick={resolve}
            type="confirm"
          />
        </div>
      ))
    })
  }
}

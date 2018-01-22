import moment from 'moment'
import { floorTime, formatTime, MOMENT_DATETIME_FORMAT } from '../helpers/time'

import {
  RESERVATION_INTERUPTION_SET_RESERVATION,
  RESERVATION_INTERUPTION_SET_FROM,
  RESERVATION_INTERUPTION_SET_TO,
  RESERVATION_INTERUPTION_FORMAT_FROM,
  RESERVATION_INTERUPTION_FORMAT_TO
} from '../actions/reservationInteruption.actions'


const defaultState = {
  reservation: undefined,
  from:        formatTime(floorTime(moment())),
  to:          formatTime(floorTime(moment().add(30, 'minutes')))
}


export default function reservationInteruption(state = defaultState, action) {
  switch (action.type) {
    case RESERVATION_INTERUPTION_SET_RESERVATION: {
      const newFrom = (action.value && moment(action.value.begins_at).isAfter(moment())) ? formatTime(moment(action.value.begins_at)) : formatTime(floorTime(moment()))
      const newTo = formatTime(moment(newFrom, MOMENT_DATETIME_FORMAT).add(15, 'minutes'))
      return {
        ...state,
        reservation: action.value,
        from:        newFrom,
        to:          newTo
      }
    }

    case RESERVATION_INTERUPTION_SET_FROM:
      return { ...state,
        from: action.value
      }

    case RESERVATION_INTERUPTION_SET_TO:
      return { ...state,
        to: action.value
      }

    case RESERVATION_INTERUPTION_FORMAT_FROM: {
      // new from has to ne in the interval of reservation and cannot be before now
      const isBeforeNow = moment(state.from, MOMENT_DATETIME_FORMAT).isBefore(moment())
      const isBeforeReservationStart = moment(state.from, MOMENT_DATETIME_FORMAT).isBefore(moment(state.reservation.begins_at))
      const isAfterReservationEnd = moment(state.from, MOMENT_DATETIME_FORMAT).isAfter(moment(state.reservation.ends_at).subtract(15, 'minutes'))
      const newFrom = (!isBeforeNow && !isBeforeReservationStart && !isAfterReservationEnd) ?
        formatTime(moment(state.from, MOMENT_DATETIME_FORMAT)) :
        isAfterReservationEnd ?
          formatTime(moment(state.reservation.ends_at).subtract(15, 'minutes')) :
        isBeforeNow && !isBeforeReservationStart ?
          formatTime(floorTime(moment())) : // now
        !isBeforeNow && isBeforeReservationStart ?
          formatTime(moment(state.reservation.begins_at)) : // reservation start
          formatTime(floorTime(moment(state.reservation.begins_at).isAfter(moment()) ?
            moment(state.reservation.begins_at) :
            moment())
          )
      const newTo = moment(newFrom, MOMENT_DATETIME_FORMAT).isSameOrAfter(moment(state.to, MOMENT_DATETIME_FORMAT)) ? formatTime(moment(newFrom, MOMENT_DATETIME_FORMAT).add(15, 'minutes')) : state.to
      return {
        ...state,
        from: newFrom,
        to:   newTo
      }
    }

    case RESERVATION_INTERUPTION_FORMAT_TO: {
      const newTo = moment(state.from, MOMENT_DATETIME_FORMAT).isSameOrAfter(moment(state.to, MOMENT_DATETIME_FORMAT)) ?
        formatTime(moment(state.from, MOMENT_DATETIME_FORMAT).add(15, 'minutes')) :
        moment(state.to, MOMENT_DATETIME_FORMAT).isAfter(moment(state.reservation.ends_at)) ?
          formatTime(moment(state.reservation.ends_at)) :
          formatTime(moment(state.to, MOMENT_DATETIME_FORMAT))
      return {
        ...state,
        to: newTo
      }
    }

    default:
      return state
  }
}

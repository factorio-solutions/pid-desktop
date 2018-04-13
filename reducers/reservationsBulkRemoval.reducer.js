import moment from 'moment'

import {
  SET_BULK_REMOVAL_GARAGES,
  SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED,
  SET_BULK_REMOVAL_AVAILABLE_USERS,
  SET_BULK_REMOVAL_USER_ID,
  SET_BULK_REMOVAL_TO,
  SET_BULK_REMOVAL_FROM,
  BULK_REMOVAL_CLEAR_FORM
}  from '../actions/reservationsBulkRemoval.actions'
import { MOMENT_DATETIME_FORMAT, ceilTime } from '../helpers/time'


const defaultState = {
  availableUsers: [],
  garages:        [],
  from:           ceilTime(moment()).format(MOMENT_DATETIME_FORMAT),
  to:             ceilTime(moment()).add(30, 'm').format(MOMENT_DATETIME_FORMAT),
  toBeRemoved:    [],
  loading:        false,
  userId:         undefined
}


export default function reservationBulkRemoval(state = defaultState, action) {
  switch (action.type) {

    case SET_BULK_REMOVAL_GARAGES:
      return {
        ...state,
        garages: action.value
      }

    case SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED:
      return {
        ...state,
        toBeRemoved: action.value
      }

    case SET_BULK_REMOVAL_AVAILABLE_USERS:
      return {
        ...state,
        availableUsers: action.value
      }

    case SET_BULK_REMOVAL_USER_ID:
      return {
        ...state,
        userId: action.value
      }

    case SET_BULK_REMOVAL_FROM:
      return {
        ...state,
        from: action.value
      }

    case SET_BULK_REMOVAL_TO:
      return {
        ...state,
        to: action.value
      }

    case BULK_REMOVAL_CLEAR_FORM:
      return defaultState

    default:
      return state
  }
}

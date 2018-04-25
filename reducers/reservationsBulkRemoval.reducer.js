import moment from 'moment'

import {
  SET_BULK_REMOVAL_GARAGES,
  TOGGLE_RESERVATION_IN_TO_BE_REMOVED,
  SET_BULK_REMOVAL_RESERVATION_TO_BE_REMOVED,
  SET_BULK_REMOVAL_AVAILABLE_USERS,
  SET_BULK_REMOVAL_USER_ID,
  SET_BULK_REMOVAL_TO,
  SET_BULK_REMOVAL_FROM,
  RESET_BULK_REMOVAL_TIMES,
  BULK_REMOVAL_CLEAR_FORM
}  from '../actions/reservationsBulkRemoval.actions'
import { MOMENT_DATETIME_FORMAT, ceilTime } from '../helpers/time'


function generateFromTo() {
  return {
    from: ceilTime(moment()).format(MOMENT_DATETIME_FORMAT),
    to:   ceilTime(moment()).add(30, 'm').format(MOMENT_DATETIME_FORMAT)
  }
}

const defaultState = {
  ...generateFromTo(),
  availableUsers: [],
  garages:        [],
  toBeRemoved:    [],
  loading:        false,
  userId:         -1
}

export default function reservationBulkRemoval(state = defaultState, action) {
  switch (action.type) {

    case SET_BULK_REMOVAL_GARAGES:
      return {
        ...state,
        garages: action.value
      }

    case TOGGLE_RESERVATION_IN_TO_BE_REMOVED: {
      const index = state.toBeRemoved.indexOf(action.value)
      return { ...state,
        toBeRemoved: index > -1 ?
            [ ...state.toBeRemoved.slice(0, index), ...state.toBeRemoved.slice(index + 1) ] :
            [ ...state.toBeRemoved, action.value ]
      }
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

    case RESET_BULK_REMOVAL_TIMES:
      return {
        ...state,
        ...generateFromTo()
      }


    case BULK_REMOVAL_CLEAR_FORM:
      return defaultState

    default:
      return state
  }
}

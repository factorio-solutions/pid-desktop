import moment from 'moment'
import { formatDate, MOMENT_DATE_FORMAT } from '../helpers/time'

import {
  SET_PID_ADMIN_GENERATOR_GARAGES,
  SET_PID_ADMIN_GENERATOR_CLIENTS,
  SET_PID_ADMIN_GENERATOR_USERS,
  TOGGLE_PID_ADMIN_GENERATOR_GARAGE,
  TOGGLE_PID_ADMIN_GENERATOR_CLIENT,
  TOGGLE_PID_ADMIN_GENERATOR_USER,
  SELECT_ALL_PID_ADMIN_GENERATOR_USERS,
  DESELECT_ALL_PID_ADMIN_GENERATOR_USERS,
  SET_PID_ADMIN_GENERATOR_COUNT,
  SET_PID_ADMIN_GENERATOR_DATE_FROM,
  SET_PID_ADMIN_GENERATOR_DATE_TO,
  SET_PID_ADMIN_GENERATOR_DAYS,
  SET_PID_ADMIN_GENERATOR_DAY_FROM,
  SET_PID_ADMIN_GENERATOR_DAY_TO,
  SET_PID_ADMIN_GENERATOR_DURATION_FROM,
  SET_PID_ADMIN_GENERATOR_DURATION_TO,
  TOGGLE_PID_ADMIN_GENERATOR_INTERNAL,
  TOGGLE_PID_ADMIN_GENERATOR_CREATE_USERS,
  SET_PID_ADMIN_GENERATOR_USERS_COUNT
}  from '../actions/pid-admin.generator.actions'

const defaultState = {
  garages:      [],
  clients:      [],
  users:        [],
  count:        100,
  dateFrom:     formatDate(moment()),
  dateTo:       formatDate(moment().add(1, 'month')),
  days:         [],
  dayFrom:      0,
  dayTo:        24,
  durationFrom: 2,
  durationTo:   8,
  internal:     true,
  createUsers:  false,
  userCount:    10
}

const toggleSelected = (array, id) => {
  const index = array.findIndexById(id)
  return [
    ...array.slice(0, index),
    { ...array[index], selected: array[index].selected ? !array[index].selected : true },
    ...array.slice(index + 1)
  ]
}


export default function pidAdminGenerator(state = defaultState, action) {
  switch (action.type) {

    case SET_PID_ADMIN_GENERATOR_GARAGES:
      return {
        ...state,
        garages: action.value
      }

    case SET_PID_ADMIN_GENERATOR_CLIENTS:
      return {
        ...state,
        clients: action.value
      }

    case SET_PID_ADMIN_GENERATOR_USERS:
      return {
        ...state,
        users: action.value
      }

    case TOGGLE_PID_ADMIN_GENERATOR_GARAGE:
      return {
        ...state,
        garages: toggleSelected(state.garages, action.value)
      }

    case TOGGLE_PID_ADMIN_GENERATOR_CLIENT:
      return {
        ...state,
        clients: toggleSelected(state.clients, action.value)
      }

    case TOGGLE_PID_ADMIN_GENERATOR_USER:
      return {
        ...state,
        users: toggleSelected(state.users, action.value)
      }

    case SELECT_ALL_PID_ADMIN_GENERATOR_USERS:
      return {
        ...state,
        users: state.users.map(user => ({ ...user, selected: true }))
      }

    case DESELECT_ALL_PID_ADMIN_GENERATOR_USERS:
      return {
        ...state,
        users: state.users.map(user => ({ ...user, selected: false }))
      }

    case SET_PID_ADMIN_GENERATOR_COUNT:
      return {
        ...state,
        count: action.value <= 0 ? 1 : action.value
      }

    case SET_PID_ADMIN_GENERATOR_DATE_FROM:
      return {
        ...state,
        dateFrom: action.value,
        dateTo:   moment(state.dateTo, MOMENT_DATE_FORMAT).isSameOrBefore(moment(action.value, MOMENT_DATE_FORMAT)) ?
          formatDate(moment(action.value, MOMENT_DATE_FORMAT).add(1, 'day')) :
          state.dateTo
      }

    case SET_PID_ADMIN_GENERATOR_DATE_TO:
      return {
        ...state,
        dateTo: moment(action.value, MOMENT_DATE_FORMAT).isSameOrBefore(moment(state.dateFrom, MOMENT_DATE_FORMAT)) ?
          formatDate(moment(state.dateFrom, MOMENT_DATE_FORMAT).add(1, 'day')) :
          action.value
      }

    case SET_PID_ADMIN_GENERATOR_DAYS: {
      const indexOf = state.days.indexOf(action.value)
      return {
        ...state,
        days: indexOf > -1 ?
        [ ...state.days.slice(0, indexOf), ...state.days.slice(indexOf + 1) ] :
        [ ...state.days, action.value ].sort((a, b) => a > b)
      }
    }

    case SET_PID_ADMIN_GENERATOR_DAY_FROM: {
      const newValue = action.value < 0 ? 0 : action.value > 23 ? 23 : action.value
      const newToValue = newValue >= state.dayTo ? newValue + 1 : state.dayTo
      const maxDuration = newToValue - newValue
      return {
        ...state,
        dayFrom:      newValue,
        dayTo:        newToValue,
        durationFrom: state.durationFrom >= maxDuration ? maxDuration - 1 : state.durationFrom,
        durationTo:   state.durationTo > maxDuration ? maxDuration : state.durationTo
      }
    }

    case SET_PID_ADMIN_GENERATOR_DAY_TO: {
      const newValue = action.value <= state.dayFrom ? state.dayFrom + 1 : action.value
      const maxDuration = newValue - state.dayFrom
      return {
        ...state,
        dayTo:        newValue,
        durationFrom: state.durationFrom >= maxDuration ? maxDuration - 1 : state.durationFrom,
        durationTo:   state.durationTo > maxDuration ? maxDuration : state.durationTo
      }
    }

    case SET_PID_ADMIN_GENERATOR_DURATION_FROM: {
      const maxDuration = state.dayTo - state.dayFrom
      const newValue = action.value < 0 ? 0 : action.value >= maxDuration ? maxDuration - 1 : action.value
      return {
        ...state,
        durationFrom: newValue,
        durationTo:   newValue >= state.durationTo ? newValue + 1 : state.durationTo
      }
    }

    case SET_PID_ADMIN_GENERATOR_DURATION_TO: {
      const maxDuration = state.dayTo - state.dayFrom
      return {
        ...state,
        durationTo: action.value <= state.durationFrom ? state.durationFrom + 1 : action.value > maxDuration ? maxDuration : action.value
      }
    }

    case TOGGLE_PID_ADMIN_GENERATOR_INTERNAL:
      return {
        ...state,
        internal: !state.internal
      }

    case TOGGLE_PID_ADMIN_GENERATOR_CREATE_USERS:
      return {
        ...state,
        createUsers: !state.createUsers
      }

    case SET_PID_ADMIN_GENERATOR_USERS_COUNT:
      return {
        ...state,
        userCount: action.value < 1 ? 1 : action.value
      }

    default:
      return state
  }
}

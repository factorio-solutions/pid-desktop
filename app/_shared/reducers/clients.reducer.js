import {
  SET_CLIENTS,
  SET_GARAGE_CONTRACTS
}  from '../actions/clients.actions'

import {
  ADMIN_CLIENT_SET_MIN_RESERVATION_DURATION,
  ADMIN_CLIENT_SET_MAX_RESERVATION_DURATION
}  from '../actions/admin.clientMinMaxDuration.actions'

const defaultState = {
  clients:         [],
  garageContracts: [],

  minReservationDuration: null,
  maxReservationDuration: null
}


export default function clients(state = defaultState, action) {
  switch (action.type) {

    case SET_CLIENTS:
      return {
        ...state,
        clients: action.value
      }

    case SET_GARAGE_CONTRACTS:
      return {
        ...state,
        garageContracts: action.value
      }

    case ADMIN_CLIENT_SET_MIN_RESERVATION_DURATION:
      return {
        ...state,
        minReservationDuration: action.value
      }

    case ADMIN_CLIENT_SET_MAX_RESERVATION_DURATION:
      return {
        ...state,
        maxReservationDuration: action.value
      }

    default:
      return state
  }
}

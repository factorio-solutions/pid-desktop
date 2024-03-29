import {
  MOBILE_NEW_RESERVATION_CLEAR_FORM,
  MOBILE_NEW_RESERVATION_SET_AUTOSELECT,
  MOBILE_NEW_RESERVATION_SET_CLIENT_ID,
  MOBILE_NEW_RESERVATION_SET_AVAILABLE_CLIENTS,
  MOBILE_NEW_RESERVATION_AVAILABLE_CARS,
  MOBILE_NEW_RESERVATION_CAR_ID,
  MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE,
  MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS,
  MOBILE_NEW_RESERVATION_SET_FROM,
  MOBILE_NEW_RESERVATION_SET_TO,
  MOBILE_NEW_RESERVATION_SET_FROM_NOW,
  MOBILE_NEW_RESERVATION_SET_DURATION,
  MOBILE_NEW_RESERVATION_SET_PLACE_ID,
  MOBILE_NEW_RESERVATION_SET_RESERVATION_ID,
  MOBILE_NEW_RESERVATION_SET_ALL,
  MOBILE_NEW_RESERVATION_SET_GUEST_RESERVATION,
  MOBILE_NEW_RESERVATION_SET_AVAILABLE_USERS,
  MOBILE_NEW_RESERVATION_SET_USER_ID,
  MOBILE_NEW_RESERVATION_SET_GARAGE,
  MOBILE_NEW_RESERVATION_SET_MIN_DURATION,
  MOBILE_NEW_RESERVATION_SET_MAX_DURATION
} from '../actions/mobile.newReservation.actions'
import { AVAILABLE_DURATIONS } from '../../reservations/newReservation.page'

const defaultState = {
  reservation_id: null, // the reservation being updated

  from: null,
  to:   null,

  fromNow:  true, // marks if  from NOW is selected or not
  duration: AVAILABLE_DURATIONS[0], // if undefined, then other is selected

  availableClients: [], // available clients for this reservation
  client_id:        null, // currently selected client

  availableUsers: [], // only in case of guest reservation
  user_id:        null, // only in case of guest reservation

  availableCars:   [], // cars of currently selected user
  car_id:          null, // selected car id
  carLicencePlate: '', // in case there are no available cars

  flexiplace:       false, // Does garage set flexible place?
  availableFloors:  null,
  autoselect:       true,
  place_id:         null, // undefined means no available places
  guestReservation: false,
  garage:           null,
  minDuration:      null,
  maxDuration:      null
}


export default function mobileNewReservation(state = defaultState, action) {
  switch (action.type) {
    case MOBILE_NEW_RESERVATION_SET_ALL: {
      const { type, ...params } = action
      return {
        ...state,
        ...params
      }
    }

    case MOBILE_NEW_RESERVATION_SET_RESERVATION_ID:
      return {
        ...state,
        reservation_id: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_FROM:
      return {
        ...state,
        from:    action.value,
        fromNow: false
      }

    case MOBILE_NEW_RESERVATION_SET_TO:
      return {
        ...state,
        to:       action.value,
        duration: undefined
      }

    case MOBILE_NEW_RESERVATION_SET_FROM_NOW:
      return {
        ...state,
        fromNow: action.value,
        from:    undefined
      }

    case MOBILE_NEW_RESERVATION_SET_DURATION:
      return {
        ...state,
        duration: action.value,
        to:       undefined
      }

    case MOBILE_NEW_RESERVATION_SET_CLIENT_ID:
      return {
        ...state,
        client_id: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_AVAILABLE_CLIENTS:
      return {
        ...state,
        availableClients: action.value
      }


    case MOBILE_NEW_RESERVATION_AVAILABLE_CARS:
      return {
        ...state,
        availableCars: action.value
      }

    case MOBILE_NEW_RESERVATION_CAR_ID:
      return {
        ...state,
        car_id: action.value
      }

    case MOBILE_NEW_RESERVATION_CAR_LICENCE_PLATE:
      return {
        ...state,
        carLicencePlate: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_AVAILABLE_USERS:
      return {
        ...state,
        availableUsers: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_USER_ID:
      return {
        ...state,
        user_id: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS:
      return {
        ...state,
        availableFloors: action.value,
        flexiplace:      action.flexiplace || false,
        autoselect:      action.flexiplace ? true : state.autoselect
      }

    case MOBILE_NEW_RESERVATION_SET_AUTOSELECT:
      return {
        ...state,
        autoselect: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_PLACE_ID:
      return {
        ...state,
        place_id: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_GUEST_RESERVATION:
      return {
        ...state,
        guestReservation: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_GARAGE:
      return {
        ...state,
        garage: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_MIN_DURATION:
      return {
        ...state,
        minDuration: action.value
      }

    case MOBILE_NEW_RESERVATION_SET_MAX_DURATION:
      return {
        ...state,
        maxDuration: action.value
      }

    case MOBILE_NEW_RESERVATION_CLEAR_FORM:
      return defaultState

    default:
      return state
  }
}

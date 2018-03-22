import moment from 'moment'
import { MOMENT_DATETIME_FORMAT, MOMENT_DATE_FORMAT } from '../helpers/time'

import {
  NEW_RESERVATION_SET_USER,
  NEW_RESERVATION_SET_NOTE,
  NEW_RESERVATION_SET_AVAILABLE_USERS,
  NEW_RESERVATION_SET_RESERVATION,

  NEW_RESERVATION_SET_HOST_NAME,
  NEW_RESERVATION_SET_HOST_PHONE,
  NEW_RESERVATION_SET_HOST_EMAIL,
  NEW_RESERVATION_SET_HOST_LANGUAGE,

  NEW_RESERVATION_SET_CLIENT_ID,
  NEW_RESERVATION_SET_RECURRING_RULE,
  NEW_RESERVATION_SHOW_RECURRING,
  NEW_RESERVATION_SET_USE_RECURRING,
  NEW_RESERVATION_SET_RECURRING_RESERVATION_ID,

  NEW_RESERVATION_CAR_ID,
  NEW_RESERVATION_CAR_LICENCE_PLATE,

  NEW_RESERVATION_SET_GARAGE,

  NEW_RESERVATION_SET_FROM,
  NEW_RESERVATION_SET_TO,
  NEW_RESERVATION_SET_PLACE_ID,
  NEW_RESERVATION_SET_PRICE,

  NEW_RESERVATION_SET_DURATION_DATE,
  NEW_RESERVATION_SET_LOADING,
  NEW_RESERVATION_SET_HIGHLIGHT,
  NEW_RESERVATION_SET_SEND_SMS,
  NEW_RESERVATION_SET_ERROR,

  NEW_RESERVATION_CLEAR_FORM
}  from '../actions/newReservation.actions'

const defaultState = {
  user:           undefined, // id of selected user reservation is for
  note:           '', // users note
  availableUsers: [], // array of other available users
  reservation:    undefined, // object with reservation to be edited

  name:     { value: '', valid: false },
  phone:    { value: '', valid: false },
  email:    { value: '', valid: false },
  language: 'en',

  client_id:                undefined, // currently selected client
  recurringRule:            undefined, // rule in string
  showRecurring:            false, // show recurring modal
  useRecurring:             false, // use recurring
  recurring_reservation_id: undefined,

  car_id:          undefined, // selected car id
  carLicencePlate: '', // in case there are no available cars

  garage: undefined, // loaded garage details // GARAGE ID IS IN HERE

  from:     '',
  to:       '',
  place_id: undefined, // if of selected place
  price:    undefined,

  durationDate: false, // set duration or end of parking?
  loading:      false,
  hightlight:   false,
  sendSMS:      false,
  error:        undefined
}


export default function newReservation(state = defaultState, action) {
  switch (action.type) {

    case NEW_RESERVATION_SET_USER:
      return { ...state,
        user: action.value
      }

    case NEW_RESERVATION_SET_NOTE:
      return { ...state,
        note: action.value
      }

    case NEW_RESERVATION_SET_AVAILABLE_USERS:
      return { ...state,
        availableUsers: action.value
      }

    case NEW_RESERVATION_SET_RESERVATION:
      return { ...state,
        reservation: action.value
      }


    case NEW_RESERVATION_SET_HOST_NAME:
      return { ...state,
        name: action.value
      }

    case NEW_RESERVATION_SET_HOST_PHONE:
      return { ...state,
        phone: action.value
      }

    case NEW_RESERVATION_SET_HOST_EMAIL:
      return { ...state,
        email: action.value
      }

    case NEW_RESERVATION_SET_HOST_LANGUAGE:
      return { ...state,
        language: action.value
      }

    case NEW_RESERVATION_SET_CLIENT_ID:
      return { ...state,
        client_id:     action.value,
        recurringRule: action.value ? state.recurringRule : undefined
      }

    case NEW_RESERVATION_SET_RECURRING_RULE: {
      const overMonth = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'months') >= 1
      return { ...state,
        recurringRule: action.value,
        showRecurring: false,
        useRecurring:  !overMonth && !!action.value
      }
    }

    case NEW_RESERVATION_SHOW_RECURRING:
      return { ...state,
        showRecurring: action.value
      }

    case NEW_RESERVATION_SET_USE_RECURRING: {
      const overMonth = moment(state.to, MOMENT_DATETIME_FORMAT).diff(moment(state.from, MOMENT_DATETIME_FORMAT), 'months') >= 1
      return { ...state,
        useRecurring:  !overMonth && action.value,
        showRecurring: !overMonth && action.value && !state.rule
      }
    }

    case NEW_RESERVATION_SET_RECURRING_RESERVATION_ID: {
      return { ...state,
        recurring_reservation_id: action.value
      }
    }

    case NEW_RESERVATION_CAR_ID:
      return { ...state,
        car_id: action.value
      }

    case NEW_RESERVATION_CAR_LICENCE_PLATE:
      return { ...state,
        carLicencePlate: action.value
      }


    case NEW_RESERVATION_SET_GARAGE:
      return { ...state,
        garage: action.value
      }


    case NEW_RESERVATION_SET_FROM:
      return { ...state,
        from:          action.value,
        to:            action.to || state.to,
        recurringRule: { ...state.recurringRule,
          starts: moment(action.value, MOMENT_DATETIME_FORMAT).format(MOMENT_DATE_FORMAT)
        }
      }

    case NEW_RESERVATION_SET_TO:
      return { ...state,
        to: action.value
      }

    case NEW_RESERVATION_SET_PLACE_ID:
      return { ...state,
        place_id: state.garage && state.garage.flexiplace ? undefined : action.value
      }

    case NEW_RESERVATION_SET_PRICE:
      return { ...state,
        price: action.value
      }


    case NEW_RESERVATION_SET_DURATION_DATE:
      return { ...state,
        durationDate: action.value
      }

    case NEW_RESERVATION_SET_LOADING:
      return { ...state,
        loading: action.value
      }

    case NEW_RESERVATION_SET_HIGHLIGHT:
      return { ...state,
        highlight: action.value
      }

    case NEW_RESERVATION_SET_SEND_SMS:
      return { ...state,
        sendSMS: action.value
      }

    case NEW_RESERVATION_SET_ERROR:
      return { ...state,
        error: action.value
      }


    case NEW_RESERVATION_CLEAR_FORM:
      return defaultState

    default:
      return state
  }
}

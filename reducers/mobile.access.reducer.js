import {
  MOBILE_ACCESS_SET_OPENED,
  MOBILE_ACCESS_SET_MESSAGE,
  MOBILE_ACCESS_SET_RESERVATION,
  MOBILE_ACCESS_SET_SELECTED_RESERVATION
}  from '../actions/mobile.access.actions'

const defaultState =  { opened:              undefined
                      , message:             undefined
                      , reservations:        [] // currently active reservations
                      , selectedReservation: 0
                      }


export default function mobileAccess (state = defaultState, action) {
  switch (action.type) {

    case MOBILE_ACCESS_SET_OPENED:
    return  { ...state
            , opened: action.value
            }

    case MOBILE_ACCESS_SET_MESSAGE:
    return  { ...state
            , message: action.value
            }

    case MOBILE_ACCESS_SET_RESERVATION:
    return  { ...state
            , reservations: action.value
            }

    case MOBILE_ACCESS_SET_SELECTED_RESERVATION:
    return  { ...state
            , selectedReservation: action.value
            }

    default:
      return state
  }
}

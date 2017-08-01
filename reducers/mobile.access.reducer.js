import {
  MOBILE_ACCESS_SET_OPENED,
  MOBILE_ACCESS_SET_MESSAGE,
  MOBILE_ACCESS_SET_SELECTED_RESERVATION,
  MOBILE_ACCESS_SET_SELECTED_GATE
}  from '../actions/mobile.access.actions'

const defaultState =  { opened:              undefined
                      , message:             undefined
                      , selectedReservation: 0
                      , selectedGate:        0
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

    case MOBILE_ACCESS_SET_SELECTED_RESERVATION:
    return  { ...state
            , selectedReservation: action.value
            , selectedGate:        0 // set defatult state
            }

    case MOBILE_ACCESS_SET_SELECTED_GATE:
    return  { ...state
            , selectedGate: action.value
            }

    default:
      return state
  }
}

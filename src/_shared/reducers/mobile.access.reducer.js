import {
  MOBILE_ACCESS_SET_OPENED,
  MOBILE_ACCESS_SET_MESSAGE
}  from '../actions/mobile.access.actions'

const defaultState =  { opened:   undefined
                      , message:  undefined
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

    default:
      return state
  }
}

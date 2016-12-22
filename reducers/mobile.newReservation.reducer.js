import { MOBILE_NEW_RESERVATION_CLEAR_FORM, MOBILE_NEW_RESERVATION_SET_AUTOSELECT, MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS, MOBILE_NEW_RESERVATION_SET_FROM, MOBILE_NEW_RESERVATION_SET_TO, MOBILE_NEW_RESERVATION_SET_FROM_NOW, MOBILE_NEW_RESERVATION_SET_DURATION, MOBILE_NEW_RESERVATION_SET_PLACE_ID }  from '../actions/mobile.newReservation.actions'

const defaultState =  { from: undefined
                      , to: undefined

                      , fromNow: true // marks if  from NOW is selected or not
                      , duration: 2 // if undefined, then other is selected

                      , availableFloors: undefined
                      , autoselect: true
                      , place_id: undefined // undefined means no available places
                      }

export default function mobileNewReservation (state = defaultState, action) {
  switch (action.type) {

    case MOBILE_NEW_RESERVATION_SET_FROM:
      return  { ...state
              , from: action.value
              }

    case MOBILE_NEW_RESERVATION_SET_TO:
      return  { ...state
              , to: action.value
              }

    case MOBILE_NEW_RESERVATION_SET_FROM_NOW:
      return  { ...state
              , fromNow: action.value
              }

    case MOBILE_NEW_RESERVATION_SET_DURATION:
      return  { ...state
              , duration: action.value
              }

    case MOBILE_NEW_RESERVATION_SET_AVAILABLE_FLOORS:
      return  { ...state
              , availableFloors: action.value
              }

    case MOBILE_NEW_RESERVATION_SET_AUTOSELECT:
      return  { ...state
              , autoselect: action.value
              }

    case MOBILE_NEW_RESERVATION_SET_PLACE_ID:
      return  { ...state
              , place_id: action.value
              }

    case MOBILE_NEW_RESERVATION_CLEAR_FORM:
      return defaultState

    default:
      return state
  }
}

import {
  NEW_RESERVATION_SET_USER,
  NEW_RESERVATION_SET_AVAILABLE_USERS,
  NEW_RESERVATION_SET_RESERVATION,

  NEW_RESERVATION_SET_CLIENT_ID,

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
  NEW_RESERVATION_SET_ERROR,

  NEW_RESERVATION_CLEAR_FORM
}  from '../actions/newReservation.actions'

const defaultState =  { user:             undefined // id of selected user reservation is for
                      , availableUsers:   [] // array of other available users
                      , reservation:      undefined // object with reservation to be edited

                      , client_id:        undefined // currently selected client

                      , car_id:           undefined // selected car id
                      , carLicencePlate:  '' // in case there are no available cars

                      , garage:           undefined // loaded garage details // GARAGE ID IS IN HERE

                      , from:             ''
                      , to:               ''
                      , place_id:         undefined // if of selected place
                      , price:            undefined

                      , durationDate:     false // set duration or end of parking?
                      , loading:          false
                      , hightlight:       false
                      , error:            undefined
                      }


export default function newReservation (state = defaultState, action) {
  switch (action.type) {

    case NEW_RESERVATION_SET_USER:
      return { ...state
             , user: action.value
             }

    case NEW_RESERVATION_SET_AVAILABLE_USERS:
      return { ...state
             , availableUsers: action.value
             }

    case NEW_RESERVATION_SET_RESERVATION:
      return { ...state
             , reservation: action.value
             }


    case NEW_RESERVATION_SET_CLIENT_ID:
      return { ...state
             , client_id: action.value
             }


    case NEW_RESERVATION_CAR_ID:
      return { ...state
             , car_id: action.value
             }

    case NEW_RESERVATION_CAR_LICENCE_PLATE:
      return { ...state
             , carLicencePlate: action.value
             }


    case NEW_RESERVATION_SET_GARAGE:
      return { ...state
             , garage: action.value
             }


    case NEW_RESERVATION_SET_FROM:
      return { ...state
             , from: action.value
             }

    case NEW_RESERVATION_SET_TO:
      return { ...state
             , to: action.value
             }

    case NEW_RESERVATION_SET_PLACE_ID:
      return { ...state
             , place_id: action.value
             }

    case NEW_RESERVATION_SET_PRICE:
      return { ...state
             , price: action.value
             }


    case NEW_RESERVATION_SET_DURATION_DATE:
      return { ...state
             , durationDate: action.value
             }

    case NEW_RESERVATION_SET_LOADING:
      return { ...state
             , loading: action.value
             }

    case NEW_RESERVATION_SET_HIGHLIGHT:
      return { ...state
             , highlight: action.value
             }

    case NEW_RESERVATION_SET_ERROR:
      return { ...state
             , error: action.value
             }


    case NEW_RESERVATION_CLEAR_FORM:
      return defaultState

    default:
      return state
  }
}

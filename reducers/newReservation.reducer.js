<<<<<<< HEAD
import { SET_USER, SET_AVAILABLE_USERS, SET_CREATOR, SET_FROM, SET_TO, SET_ACCOUNT, SET_AVAILABLE_ACCOUNTS, SET_PLACE, SET_AVAILABLE_PLACES, SET_FLOOR, SET_AVAILABLE_FLOORS, SET_GARAGE, SET_AVAILABLE_GARAGES, SET_DURATIONDATE, SET_AUTOSELECT, CLEAR_RESERVATION_FORM, SET_ERROR }  from '../actions/newReservation.actions'

const defaultState =  { user_id: -1 // id of selected user reservation is for
                      , availableUsers: [] // array of other available users

                      , from: ''
                      , to:   ''

                      , account_id: -1 // currently selected account
                      , availableAccounts: [] // available accounts for this reservation

                      , place_id: -1 // json object of selected place

                      , floor_id: -1
                      , availableFloors:[] // available places are here in free_places

                      , garage_id: -1 // index of currently selected garage
                      , availableGarages: [] // all available garages

                      , durationDate: false // set duration or end of parking?
                      , autoSelectPlace: true

                      , error: undefined
                      }

export default function newReservation (state = defaultState, action) {
  switch (action.type) {

    case SET_USER:
    return  { ...state
            , user_id: action.value
            }

    case SET_AVAILABLE_USERS:
    return  { ...state
            , availableUsers: action.value
            }


    case SET_FROM:
    return  { ...state
            , from: action.value
            }

    case SET_TO:
    return  { ...state
            , to: action.value
            }


    case SET_ACCOUNT:
    return  { ...state
            , account_id: action.value
            }

    case SET_AVAILABLE_ACCOUNTS:
    return  { ...state
            , availableAccounts: action.value
            }


    case SET_PLACE:
    return  { ...state
            , place_id: action.value
            }

    // case SET_AVAILABLE_PLACES:
    case SET_AVAILABLE_PLACES:
    return  { ...state
            , availablePlaces: action.value
            }


    case SET_FLOOR:
    return { ...state
           , floor_id: action.value
           }
    case SET_AVAILABLE_FLOORS:
    return  { ...state
            , availableFloors: action.value
            }


    case SET_GARAGE:
    return  { ...state
            , garage_id: action.value
            }

    case SET_AVAILABLE_GARAGES:
    return  { ...state
            , availableGarages: action.value
            }


    case SET_DURATIONDATE:
    return  { ...state
            , durationDate: action.value
            }


    case SET_AUTOSELECT:
    return  { ...state
            , autoSelectPlace: action.value
            }

    case SET_ERROR:
    return  { ...state
            , error: action.value
            }

    case CLEAR_RESERVATION_FORM:
=======
import {
  NEW_RESERVATION_SET_USER_ID,
  NEW_RESERVATION_SET_AVAILABLE_USERS,

  NEW_RESERVATION_SET_CLIENT_ID,
  NEW_RESERVATION_SET_AVAILABLE_CLIENTS,

  NEW_RESERVATION_AVAILABLE_CARS,
  NEW_RESERVATION_CAR_ID,
  NEW_RESERVATION_CAR_LICENCE_PLATE,

  NEW_RESERVATION_SET_GARAGE_INDEX,
  NEW_RESERVATION_SET_AVAILABLE_GARAGES,
  NEW_RESERVATION_SET_GARAGE,

  NEW_RESERVATION_SET_FROM,
  NEW_RESERVATION_SET_TO,
  NEW_RESERVATION_SET_PLACE_ID,

  NEW_RESERVATION_SET_DURATION_DATE,
  NEW_RESERVATION_SET_PRICE,
  NEW_RESERVATION_SET_ERROR,
  NEW_RESERVATION_SET_BRAINTREE_TOKEN,

  NEW_RESERVATION_CLEAR_FORM
}  from '../actions/newReservation.actions'

const defaultState =  { user_id:          undefined // id of selected user reservation is for
                      , availableUsers:   [] // array of other available users

                      , client_id:        undefined // currently selected client
                      , availableClients: [] // available clients for this reservation

                      , availableCars:    [] // cars of currently selected user
                      , car_id:           undefined // selected car id
                      , carLicencePlate:  '' // in case there are no available cars

                      , garageIndex:      undefined // index of currently selected garage
                      , availableGarages: [] // all available garages
                      , garage:           undefined // garage object with details

                      , from:             ''
                      , to:               ''
                      , place_id:         undefined // if of selected place


                      , durationDate:     false // set duration or end of parking?
                      , price:            undefined
                      , error:            undefined
                      , braintree_token:  undefined
                      }


export default function newReservation (state = defaultState, action) {
  switch (action.type) {

    case NEW_RESERVATION_SET_USER_ID:
      return { ...state
             , user_id: action.value
             }

    case NEW_RESERVATION_SET_AVAILABLE_USERS:
      return { ...state
             , availableUsers: action.value
             }

    case NEW_RESERVATION_SET_CLIENT_ID:
      return { ...state
             , client_id: action.value
             }

    case NEW_RESERVATION_SET_AVAILABLE_CLIENTS:
      return { ...state
             , availableClients: action.value
             }


    case NEW_RESERVATION_AVAILABLE_CARS:
      return { ...state
             , availableCars: action.value
             }

    case NEW_RESERVATION_CAR_ID:
      return { ...state
             , car_id: action.value
             }

    case NEW_RESERVATION_CAR_LICENCE_PLATE:
      return { ...state
             , carLicencePlate: action.value
             }

    case NEW_RESERVATION_SET_GARAGE_INDEX:
      return { ...state
             , garageIndex: action.value
             }

    case NEW_RESERVATION_SET_AVAILABLE_GARAGES:
      return { ...state
             , availableGarages: action.value
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

    case NEW_RESERVATION_SET_DURATION_DATE:
      return { ...state
             , durationDate: action.value
             }

    case NEW_RESERVATION_SET_PRICE:
      return { ...state
             , price: action.value
             }

    case NEW_RESERVATION_SET_ERROR:
      return { ...state
             , error: action.value
             }

    case NEW_RESERVATION_SET_BRAINTREE_TOKEN:
      return { ...state
             , braintree_token: action.value
             }

    case NEW_RESERVATION_CLEAR_FORM:
>>>>>>> feature/new_api
    return defaultState

    default:
      return state
  }
}

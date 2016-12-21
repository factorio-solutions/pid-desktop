import {
  SET_USER,
  SET_AVAILABLE_USERS,
  SET_CREATOR,
  SET_FROM,
  SET_TO,
  SET_ACCOUNT,
  SET_AVAILABLE_ACCOUNTS,
  SET_PLACE,
  SET_AVAILABLE_PLACES,
  SET_FLOOR,
  SET_AVAILABLE_FLOORS,
  SET_GARAGE,
  SET_AVAILABLE_GARAGES,
  SET_DURATIONDATE,
  SET_AUTOSELECT,
  CLEAR_RESERVATION_FORM,
  SET_ERROR
}  from '../actions/newReservation.actions'

const defaultState =  { user_id:        -1 // id of selected user reservation is for
                      , availableUsers: [] // array of other available users

                      , from: ''
                      , to:   ''

                      , account_id:         -1 // currently selected account
                      , availableAccounts:  [] // available accounts for this reservation

                      , place_id: -1 // json object of selected place

                      , floor_id:       -1
                      , availableFloors:[] // available places are here in free_places

                      , garage_id:        -1 // index of currently selected garage
                      , availableGarages: [] // all available garages

                      , durationDate:     false // set duration or end of parking?
                      , autoSelectPlace:  true

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
    return defaultState

    default:
      return state
  }
}

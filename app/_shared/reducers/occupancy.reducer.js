import moment from 'moment'
<<<<<<< HEAD
import { OCCUPANCY_SET_GARAGE, OCCUPANCY_SET_GARAGES, OCCUPANCY_SET_GARAGE_ID, OCCUPANCY_SET_ACCOUNTS, OCCUPANCY_SET_ACCOUNT_ID, OCCUPANCY_SET_DURATION, OCCUPANCY_SET_FROM }  from '../actions/occupancy.actions'

const defaultState =  { garage: undefined, // current one
                        garages: [],       // all available
                        garage_id: undefined, // selected by picker
                        accounts: [],
                        account_id: undefined,
                        duration: "week",
                        from: moment().startOf('day')
                      }

=======
import {
  OCCUPANCY_SET_GARAGE,
  OCCUPANCY_SET_GARAGES,
  OCCUPANCY_SET_GARAGE_ID,
  OCCUPANCY_SET_CLIENTS,
  OCCUPANCY_SET_CLIENT_ID,
  OCCUPANCY_SET_DURATION,
  OCCUPANCY_SET_FROM
}  from '../actions/occupancy.actions'

const defaultState =  { garage:     undefined // current one
                      , garages:    []       // all available
                      , garage_id:  undefined // selected by picker
                      , clients:    []
                      , client_id:  undefined
                      , duration:   "week"
                      , from:       moment().startOf('day')
                      }


>>>>>>> feature/new_api
export default function occupancy (state = defaultState, action) {
  switch (action.type) {

    case OCCUPANCY_SET_GARAGE:
    return  { ...state
            , garage: action.value
            }

    case OCCUPANCY_SET_GARAGES:
    return  { ...state
            , garages: action.value
            }

    case OCCUPANCY_SET_GARAGE_ID:
    return  { ...state
            , garage_id: action.value
            }


<<<<<<< HEAD
    case OCCUPANCY_SET_ACCOUNTS:
    return  { ...state
            , accounts: action.value
            }

    case OCCUPANCY_SET_ACCOUNT_ID:
    return  { ...state
            , account_id: action.value
=======
    case OCCUPANCY_SET_CLIENTS:
    return  { ...state
            , clients: action.value
            }

    case OCCUPANCY_SET_CLIENT_ID:
    return  { ...state
            , client_id: action.value
>>>>>>> feature/new_api
            }


    case OCCUPANCY_SET_DURATION:
    return  { ...state
            , duration: action.value
            }

    case OCCUPANCY_SET_FROM:
    return  { ...state
            , from: action.value
            }

    default:
      return state
  }
}

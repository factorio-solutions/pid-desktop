import moment from 'moment'
import {
  OCCUPANCY_SET_GARAGE,
  OCCUPANCY_SET_CLIENTS,
  OCCUPANCY_SET_CLIENT_ID,
  OCCUPANCY_SET_DURATION,
  OCCUPANCY_SET_FROM,
  OCCUPANCY_SET_LOADING
}  from '../actions/occupancy.actions'

const defaultState =  { garage:     undefined // current one
                      , clients:    []
                      , client_id:  undefined
                      , duration:   "week"
                      , from:       moment().startOf('day')
                      , loading:    false
                      }


export default function occupancy (state = defaultState, action) {
  switch (action.type) {

    case OCCUPANCY_SET_GARAGE:
    return  { ...state
            , garage: action.value
            }

    case OCCUPANCY_SET_CLIENTS:
    return  { ...state
            , clients: action.value
            }

    case OCCUPANCY_SET_CLIENT_ID:
    return  { ...state
            , client_id: action.value
            , loading: true
            }

    case OCCUPANCY_SET_DURATION:
    return  { ...state
            , duration: action.value
            , loading: true
            }

    case OCCUPANCY_SET_FROM:
    return  { ...state
            , from: action.value
            , loading: true
            }

    case OCCUPANCY_SET_LOADING:
    return  { ...state
            , loading: action.value
            }

    default:
      return state
  }
}

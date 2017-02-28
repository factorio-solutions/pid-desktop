import moment from 'moment'
import {
  SET_GATE_PLACES_GARAGE,
  SET_GATE_PLACES_GATES,
  SET_GATE_PLACES_GATE,
  GATE_PLACES_RESET_FORM
}  from '../actions/garageGates.actions'

const defaultState =  { garage:        undefined
                      , gates:         []
                      // only one can be selected at time
                      , gate_id:       undefined
                      }


export default function garageGates (state = defaultState, action) {
  switch (action.type) {

    case SET_GATE_PLACES_GARAGE:
      return { ...state
             , garage: action.value
             }

    case SET_GATE_PLACES_GATES:
      return { ...state
             , gates: action.value
             }

    case SET_GATE_PLACES_GATE:
      return { ...state
             , gate_id: action.value
             }

    case GATE_PLACES_RESET_FORM:
    return  defaultState

    default:
      return state
  }
}

<<<<<<< HEAD
import { SET_RESERVATIONS, SET_RESERVATIONS_TABLEVIEW }  from '../actions/reservations.actions'

const defaultState =  { reservations: []
                      , tableView: true
=======
import {
  SET_RESERVATIONS,
  SET_RESERVATIONS_TABLEVIEW
}  from '../actions/reservations.actions'

const defaultState =  { reservations: []
                      , tableView:    true
>>>>>>> feature/new_api
                      }

export default function reservations (state = defaultState, action) {
  switch (action.type) {

    case SET_RESERVATIONS:
    return  { ...state
            , reservations: action.value
            }

    case SET_RESERVATIONS_TABLEVIEW:
    return  { ...state
            , tableView: action.value
            }

    default:
      return state
  }
}

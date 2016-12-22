import { SET_GARAGES, SET_GARAGES_TABLEVIEW }  from '../actions/garages.actions'

const defaultState =  { garages: []
                      , tableView: true
                      }

export default function garages (state = defaultState, action) {
  switch (action.type) {

    case SET_GARAGES:
    return  { ...state
            , garages: action.value
            }

    case SET_GARAGES_TABLEVIEW:
    return  { ...state
            , tableView: action.value
            }

    default:
      return state
  }
}

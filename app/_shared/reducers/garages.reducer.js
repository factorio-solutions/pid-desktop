import {
  GARAGES_SET_GARAGES,
  GARAGES_SET_GARAGES_TABLEVIEW,
  GARAGES_SET_PRICINGS,
  GARAGES_SET_RENTS
}  from '../actions/garages.actions'

const defaultState =  { garages:    []
                      , pricings:   []
                      , rents:      []
                      , tableView:  true
                      }


export default function garages (state = defaultState, action) {
  switch (action.type) {

    case GARAGES_SET_GARAGES:
    return  { ...state
            , garages: action.value
            }
    case GARAGES_SET_PRICINGS:
    return  { ...state
            , pricings: action.value
            }
    case GARAGES_SET_RENTS:
    return  { ...state
            , rents: action.value
            }

    case GARAGES_SET_GARAGES_TABLEVIEW:
    return  { ...state
            , tableView: action.value
            }

    default:
      return state
  }
}
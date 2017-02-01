import moment from 'moment'
import {
  CLIENTPLACES_RESET_FORM,
  SET_CLIENTPLACES_FROM,
  SET_CLIENTPLACES_TO,
  SET_CLIENTPLACES_CLIENTS,
  SET_CLIENTPLACES_FLOORS,
  SET_CLIENTPLACES_GARAGE,
  SET_CLIENTPLACES_FLOOR,
  SET_CLIENTPLACES_CLIENT
}  from '../actions/garageClients.actions'

const defaultState =  { clients:         []
                      , client_id:       undefined
                      , garage:           undefined
                      , selectedFloor:    undefined
                      , availableFloors:  []
                      , from:             moment().startOf('month').format('DD.MM.YYYY')
                      , to:               moment().endOf('month').format('DD.MM.YYYY')
                      }


export default function garageClients (state = defaultState, action) {
  switch (action.type) {

    case SET_CLIENTPLACES_CLIENTS:
    return  { ...state
            , clients: action.value
            }

    case SET_CLIENTPLACES_CLIENT:
    return  { ...state
            , client_id: action.value
            }

    case SET_CLIENTPLACES_GARAGE:
    return  { ...state
            , garage: action.value
            }

    case SET_CLIENTPLACES_FLOOR:
    return  { ...state
            , selectedFloor: action.value
            }

    case SET_CLIENTPLACES_FLOORS:
    return  { ...state
            , availableFloors: action.value
            }

    case SET_CLIENTPLACES_FROM:
    return  { ...state
            , from: action.value
            }

    case SET_CLIENTPLACES_TO:
    return  { ...state
            , to: action.value
            }

    case CLIENTPLACES_RESET_FORM:
    return  defaultState

    default:
      return state
  }
}

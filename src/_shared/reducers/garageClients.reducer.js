import moment from 'moment'
import {
  SET_CLIENTPLACES_GARAGE,
  SET_CLIENTPLACES_CLIENTS,
  SET_CLIENTPLACES_CLIENT,
  SET_CLIENTPLACES_GATES,
  SET_CLIENTPLACES_GATE,
  SET_CLIENTPLACES_PRICINGS,
  SET_CLIENTPLACES_PRICING,
  SET_CLIENTPLACES_RENTS,
  SET_CLIENTPLACES_RENT,
  SET_CLIENTPLACES_FROM,
  SET_CLIENTPLACES_TO,
  SET_CLIENTPLACES_NEW_CLIENT_ID, 
  CLIENTPLACES_RESET_FORM
}  from '../actions/garageClients.actions'

const defaultState =  { garage:        undefined
                      , clients:       []
                      , gates:         []
                      , pricings:      []
                      , rents:         []
                      // only one can be selected at time
                      , client_id:     undefined
                      , gate_id:       undefined
                      , pricing_id:    undefined
                      , rent_id:       undefined
                      , new_client_id: ''
                      // , from:             moment().startOf('month').format('DD.MM.YYYY')
                      // , to:               moment().endOf('month').format('DD.MM.YYYY')
                      }


export default function garageClients (state = defaultState, action) {
  switch (action.type) {

    case SET_CLIENTPLACES_GARAGE:
      return { ...state
             , garage: action.value
             }

    case SET_CLIENTPLACES_CLIENTS:
      return { ...state
             , clients: action.value
             }

    case SET_CLIENTPLACES_CLIENT:
      return { ...state
             , client_id: action.value
             , gate_id: undefined
             , pricing_id: undefined
             , rent_id: undefined
             }

    case SET_CLIENTPLACES_GATES:
      return { ...state
             , gates: action.value
             }

    case SET_CLIENTPLACES_GATE:
      return { ...state
             , client_id: undefined
             , gate_id: action.value
             , pricing_id: undefined
             , rent_id: undefined
             }

    case SET_CLIENTPLACES_PRICINGS:
      return { ...state
             , pricings: action.value
             }

    case SET_CLIENTPLACES_PRICING:
      return { ...state
             , client_id: undefined
             , gate_id: undefined
             , pricing_id: action.value
             , rent_id: undefined
             }

    case SET_CLIENTPLACES_RENTS:
      return { ...state
             , rents: action.value
             }

    case SET_CLIENTPLACES_RENT:
      return { ...state
             , client_id: undefined
             , gate_id: undefined
             , pricing_id: undefined
             , rent_id: action.value
             }

    case SET_CLIENTPLACES_FROM:
      return { ...state
             , from: action.value
             }

    case SET_CLIENTPLACES_TO:
      return { ...state
             , to: action.value
             }

    case SET_CLIENTPLACES_NEW_CLIENT_ID:
      return { ...state
             , new_client_id: action.value
             }

    case CLIENTPLACES_RESET_FORM:
    return  defaultState

    default:
      return state
  }
}

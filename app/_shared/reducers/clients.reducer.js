import { SET_CLIENTS, SET_GARAGE_CONTRACTS }  from '../actions/clients.actions'

const defaultState =  { clients:         []
                      , garageContracts: []
                      }


export default function clients (state = defaultState, action) {
  switch (action.type) {

    case SET_CLIENTS:
      return  { ...state
              , clients: action.value
              }

    case SET_GARAGE_CONTRACTS:
      return  { ...state
              , garageContracts: action.value
              }

    default:
      return state
  }
}

import { SET_CLIENTS }  from '../actions/clients.actions'

const defaultState =  { clients: [] }


export default function clients (state = defaultState, action) {
  switch (action.type) {

    case SET_CLIENTS:
    return  { ...state
            , clients: action.value
            }

    default:
      return state
  }
}

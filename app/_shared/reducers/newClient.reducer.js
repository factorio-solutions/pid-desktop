import {
  SET_CLIENT_NAME,
  CLEAR_CLIENT_FORM
}  from '../actions/newClient.actions'

const defaultState =  { name: "" }


export default function newClient (state = defaultState, action) {
  switch (action.type) {

    case SET_CLIENT_NAME:
    return  { ...state
            , name: action.value
            }

    case CLEAR_CLIENT_FORM:
    return defaultState

    default:
      return state
  }
}

import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'

import { CREATE_NEW_CLIENT, EDIT_CLIENT_INIT, EDIT_CLIENT_MUTATION } from '../queries/newClient.queries'

export const SET_CLIENT_NAME   = "SET_CLIENT_NAME"
export const CLEAR_CLIENT_FORM = "CLEAR_CLIENT_FORM"


export function setName (name){
  return  { type: SET_CLIENT_NAME
          , value: name
          }
}

export function clearForm (){
  return  { type: CLEAR_CLIENT_FORM }
}


export function initClient(id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setName(response.data.client_users[0].client.name))
    }

    request( onSuccess
           , EDIT_CLIENT_INIT
           , { id: parseInt(id)}
           )
  }
}

export function submitNewClient(id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(clearForm())
      nav.to('/clients')
    }

    if (id) { // then edit client
      request( onSuccess
             , EDIT_CLIENT_MUTATION
             , { id: parseInt(id), client: {name: getState().newClient.name }}
             , "RenameClient"
             )
    } else { // then new client
      request( onSuccess
             , CREATE_NEW_CLIENT
             , { client: {name: getState().newClient.name }}
             , "garageMutations"
             )
    }
  }
}

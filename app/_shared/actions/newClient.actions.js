import { request } from '../helpers/request'
import * as nav    from '../helpers/navigation'

import { CREATE_NEW_CLIENT, EDIT_CLIENT_INIT, EDIT_CLIENT_MUTATION } from '../queries/newClient.queries'

export const SET_CLIENT_NAME        = "SET_CLIENT_NAME"
export const SET_CLIENT_IC          = "SET_CLIENT_IC"
export const SET_CLIENT_DIC         = "SET_CLIENT_DIC"
export const SET_CLIENT_LINE1       = "SET_CLIENT_LINE1"
export const SET_CLIENT_LINE2       = "SET_CLIENT_LINE2"
export const SET_CLIENT_CITY        = "SET_CLIENT_CITY"
export const SET_CLIENT_POSTAL_CODE = "SET_CLIENT_POSTAL_CODE"
export const SET_CLIENT_STATE       = "SET_CLIENT_STATE"
export const SET_CLIENT_COUNTRY     = "SET_CLIENT_COUNTRY"
export const CLEAR_CLIENT_FORM      = "CLEAR_CLIENT_FORM"


export function setName (name){
  return  { type: SET_CLIENT_NAME
          , value: name
          }
}

export function setIC (IC){
  return  { type: SET_CLIENT_IC
          , value: IC
          }
}

export function setDIC (DIC){
  return  { type: SET_CLIENT_DIC
          , value: DIC
          }
}

export function setLine1 (value) {
  return { type: SET_CLIENT_LINE1
         , value
         }
}

export function setLine2 (value) {
  return { type: SET_CLIENT_LINE2
         , value
         }
}

export function setCity (value) {
  return { type: SET_CLIENT_CITY
         , value
         }
}

export function setPostalCode (value) {
  return { type: SET_CLIENT_POSTAL_CODE
         , value
         }
}

export function setState (value) {
  return { type: SET_CLIENT_STATE
         , value
         }
}

export function setCountry (value) {
  return { type: SET_CLIENT_COUNTRY
         , value
         }
}

export function clearForm (){
  return  { type: CLEAR_CLIENT_FORM }
}


export function initClient(id) {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setName(response.data.client_users[0].client.name))
      dispatch(setLine1(response.data.client_users[0].client.address.line_1))
      dispatch(setLine2(response.data.client_users[0].client.address.line_2))
      dispatch(setCity(response.data.client_users[0].client.address.city))
      dispatch(setPostalCode(response.data.client_users[0].client.address.postal_code))
      dispatch(setState(response.data.client_users[0].client.address.state))
      dispatch(setCountry(response.data.client_users[0].client.address.country))
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
             , { id: parseInt(id)
               , client: generateClient(getState().newClient)
               }
             , "RenameClient"
             )
    } else { // then new client
      request( onSuccess
             , CREATE_NEW_CLIENT
             , { client: generateClient(getState().newClient) }
             , "garageMutations"
             )
    }
  }
}

function generateClient(state){
  return { name: state.name
         , ic:   state.ic === "" ? undefined : state.ic
         , dic:  state.dic === "" ? undefined : state.dic
         , address: { line_1:      state.line_1
                    , line_2:      state.line_2 === "" ? undefined : state.line_2
                    , city:        state.city
                    , postal_code: state.postal_code
                    , state:       state.state === "" ? undefined : state.state
                    , country:     state.country
                    }
         }
}

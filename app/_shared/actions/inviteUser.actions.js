import { request } from '../helpers/request'
// import * as nav    from '../helpers/navigation'
import { t }       from '../modules/localization/localization'

import { USER_AVAILABLE, ADD_CLIENTUSER, INIT_CLIENTS } from '../queries/inviteUser.queries'

export const INVITE_USER_SET_EMAIL                = "INVITE_USER_SET_EMAIL"
export const INVITE_USER_SET_MESSAGE              = "INVITE_USER_SET_MESSAGE"
export const INVITE_USER_SET_NAME                 = "INVITE_USER_SET_NAME"
export const INVITE_USER_SET_PHONE                = "INVITE_USER_SET_PHONE"
export const INVITE_USER_SET_CAN_MANAGE           = "INVITE_USER_SET_CAN_MANAGE"
export const INVITE_USER_SET_CAN_CREATE_OWN       = "INVITE_USER_SET_CAN_CREATE_OWN"
export const INVITE_USER_SET_CAN_CREATE_INTERNAL  = "INVITE_USER_SET_CAN_CREATE_INTERNAL"
export const INVITE_USER_SET_IS_INTERNAL          = "INVITE_USER_SET_IS_INTERNAL"
export const INVITE_USER_SET_CLIENT              = "INVITE_USER_SET_CLIENT"
export const INVITE_USER_SET_CLIENTS             = "INVITE_USER_SET_CLIENTS"
export const INVITE_USER_SET_ERROR                = "INVITE_USER_SET_ERROR"
export const INVITE_USER_SET_SUCCESS              = "INVITE_USER_SET_SUCCESS"
export const INVITE_USER_RESET_FORM               = "INVITE_USER_RESET_FORM"
export const INVITE_USER_SET_CURRENT_EMAIL        = "INVITE_USER_SET_CURRENT_EMAIL"


export function setEmail (email){
  return  { type: INVITE_USER_SET_EMAIL
          , value: email
          }
}
export function setMessage (message){
  return  { type: INVITE_USER_SET_MESSAGE
          , value: message
          }
}
export function setName (name){
  return  { type: INVITE_USER_SET_NAME
          , value: name
          }
}
export function setPhone (phone){
  return  { type: INVITE_USER_SET_PHONE
          , value: phone
          }
}

export function setCanManage (bool){
  return  { type: INVITE_USER_SET_CAN_MANAGE
          , value: bool
          }
}
export function setCanCreateOwn (bool){
  return  { type: INVITE_USER_SET_CAN_CREATE_OWN
          , value: bool
          }
}
export function setCanCreateInternal (bool){
  return  { type: INVITE_USER_SET_CAN_CREATE_INTERNAL
          , value: bool
          }
}
export function setIsInternal (bool){
  return  { type: INVITE_USER_SET_IS_INTERNAL
          , value: bool
          }
}

export function setClients (clients){
  return  { type: INVITE_USER_SET_CLIENTS
          , value: clients
          }
}
export function setClient (id){
  return  { type: INVITE_USER_SET_CLIENT
          , value: id
          }
}

export function setError (error){
  return  { type: INVITE_USER_SET_ERROR
          , value: error
          }
}
export function setSuccess (success){
  return  { type: INVITE_USER_SET_SUCCESS
          , value: success
          }
}
export function setCurrentEmail (email){
  return  { type: INVITE_USER_SET_CURRENT_EMAIL
          , value: email
          }
}

export function resetForm (){
  return  { type: INVITE_USER_RESET_FORM }
}




export function initClients () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.manageble_clients.length == 0){
        dispatch(setSuccess(t(['inviteUser', 'noClients'])))
      } else {
        dispatch(setClients(response.data.manageble_clients))
        if (getState().inviteUser.client_id == undefined && response.data.manageble_clients.length > 0){
          dispatch(setClient(response.data.manageble_clients[0].id))
        }
      }
    }

    request (onSuccess, INIT_CLIENTS)
  }
}

export function setInternal () {
    return (dispatch, getState) => {
      dispatch(setCanCreateOwn(true))
      dispatch(setCanCreateInternal(false))
      dispatch(setIsInternal(true))
    }
}

export function setSecretary () {
    return (dispatch, getState) => {
      dispatch(setCanCreateOwn(true))
      dispatch(setCanCreateInternal(true))
      dispatch(setIsInternal(true))
    }
}

export function dismissModal () {
  return (dispatch, getState) => {
    dispatch(setError( undefined ))
    dispatch(setSuccess( undefined ))
  }
}

export function createNewClientUser (client_id) {
  return (dispatch, getState) => {
    const state = getState().inviteUser

    const emails = state.email.value.match(/\b[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}\b/g) //parse emails from coma separated string
    var unsucessfull = []

    const emailsSend = () => { // after invitations
      console.log('here', emails, unsucessfull);
      dispatch(setCurrentEmail(undefined))
      dispatch(resetForm())
      if (emails.length > 1){
        dispatch(setSuccess( t(['inviteUser', 'sucessfullyInvited'], { success: (emails.length-unsucessfull.length), failed: unsucessfull.length==0 ? t(['inviteUser', 'zero']) : unsucessfull.join(', ') }) ))
      } else {
        unsucessfull.length == 1 ? dispatch(setError( t(['inviteUser', 'connectionExists']) )) : dispatch(setSuccess( t(['inviteUser', 'notificationSend']) ))
      }
    }

    emails.forEach((email, index)=>{ // send all the invitations
      const onSuccess = (response) => {
        emails.length-1 == index && emailsSend()
      }

      const onUserExists = (response) => {
        if (response.data.user_by_email==null){
          // emails.length == 1 ? dispatch(setError( t(['inviteUser', 'connectionExists']) )) :
          unsucessfull.push(email)
          onSuccess(undefined)
        }else{
          // emails.length == 1 && dispatch(setSuccess( t(['inviteUser', 'notificationSend']) ))

          request( onSuccess
                 , ADD_CLIENTUSER
                 ,{ pending_client_user:{
                      message: ["clientInvitationMessage", state.clients.find((client)=>{return client.id == state.client_id}).name].join(';'),
                      custom_message: state.message,
                      can_manage: state.can_manage,
                      can_create_own: state.can_create_own,
                      can_create_internal: state.can_create_internal,
                      is_internal: state.is_internal,
                  	},
                    "user_id": response.data.user_by_email.id,
                    "client_id": parseInt(state.client_id)
                  })
        }
      }

      dispatch(setCurrentEmail(email))
      request (onUserExists, USER_AVAILABLE,
        {user:
          { email: email.toLowerCase(),
            "full_name": state.full_name,
            "phone": state.phone
          },
          client_id: parseInt(state.client_id)})

    })
  }
}

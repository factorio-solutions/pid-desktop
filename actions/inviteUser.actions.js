import { request } from '../helpers/request'
// import * as nav    from '../helpers/navigation'
import { t }       from '../modules/localization/localization'

import { USER_AVAILABLE, ADD_ACCOUNTUSER, INIT_ACCOUNTS } from '../queries/inviteUser.queries'

export const INVITE_USER_SET_EMAIL                = "INVITE_USER_SET_EMAIL"
export const INVITE_USER_SET_MESSAGE              = "INVITE_USER_SET_MESSAGE"
export const INVITE_USER_SET_NAME                 = "INVITE_USER_SET_NAME"
export const INVITE_USER_SET_PHONE                = "INVITE_USER_SET_PHONE"
export const INVITE_USER_SET_CAN_MANAGE           = "INVITE_USER_SET_CAN_MANAGE"
export const INVITE_USER_SET_CAN_CREATE_OWN       = "INVITE_USER_SET_CAN_CREATE_OWN"
export const INVITE_USER_SET_CAN_CREATE_INTERNAL  = "INVITE_USER_SET_CAN_CREATE_INTERNAL"
export const INVITE_USER_SET_IS_INTERNAL          = "INVITE_USER_SET_IS_INTERNAL"
export const INVITE_USER_SET_ACCOUNT              = "INVITE_USER_SET_ACCOUNT"
export const INVITE_USER_SET_ACCOUNTS             = "INVITE_USER_SET_ACCOUNTS"
export const INVITE_USER_SET_ERROR                = "INVITE_USER_SET_ERROR"
export const INVITE_USER_SET_SUCCESS              = "INVITE_USER_SET_SUCCESS"
export const INVITE_USER_RESET_FORM               = "INVITE_USER_RESET_FORM"


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

export function setAccounts (accounts){
  return  { type: INVITE_USER_SET_ACCOUNTS
          , value: accounts
          }
}
export function setAccount (id){
  return  { type: INVITE_USER_SET_ACCOUNT
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

export function resetForm (){
  return  { type: INVITE_USER_RESET_FORM }
}




export function initAccounts () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      if (response.data.manageble_accounts.length == 0){
        dispatch(setSuccess(t(['inviteUser', 'noAccounts'])))
      } else {
        dispatch(setAccounts(response.data.manageble_accounts))
        if (getState().inviteUser.account_id == undefined && response.data.manageble_accounts.length > 0){
          dispatch(setAccount(response.data.manageble_accounts[0].id))
        }
      }
    }

    request (onSuccess, INIT_ACCOUNTS)
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

export function createNewAccountUser (account_id) {
  return (dispatch, getState) => {
    const state = getState().inviteUser

    const onSuccess = (response) => {
      dispatch(resetForm())
    }

    const onUserExists = (response) => {
      if (response.data.user_by_email==null){
        dispatch(setError( t(['inviteUser', 'noSuchUser']) ))

      }else{
        dispatch(setSuccess( t(['inviteUser', 'notificationSend']) ))

        request( onSuccess
               , ADD_ACCOUNTUSER
               ,{ pending_account_user:{
                    message: ["accountInvitationMessage", state.accounts.find((account)=>{return account.id == state.account_id}).name].join(';'),
                    custom_message: state.message,
                    can_manage: state.can_manage,
                    can_create_own: state.can_create_own,
                    can_create_internal: state.can_create_internal,
                    is_internal: state.is_internal,
                	},
                  "user_id": response.data.user_by_email.id,
                  "account_id": parseInt(state.account_id)
                })
      }
    }

    request (onUserExists, USER_AVAILABLE,
      {user:
        { email: state.email.value.toLowerCase(),
          "full_name": state.full_name,
          "phone": state.phone
        },
        account_id: parseInt(state.account_id)})
  }
}

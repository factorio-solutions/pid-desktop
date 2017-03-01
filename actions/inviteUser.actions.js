import { request } from '../helpers/request'
// import * as nav    from '../helpers/navigation'
import { t }       from '../modules/localization/localization'

<<<<<<< HEAD
import { USER_AVAILABLE, ADD_ACCOUNTUSER, INIT_ACCOUNTS } from '../queries/inviteUser.queries'

=======
import { USER_AVAILABLE, ADD_MANAGEBLES, INIT_MANAGEBLES } from '../queries/inviteUser.queries'

export const INVITE_USER_BOOLEAN_ATTR             = "INVITE_USER_BOOLEAN_ATTR"
>>>>>>> feature/new_api
export const INVITE_USER_SET_EMAIL                = "INVITE_USER_SET_EMAIL"
export const INVITE_USER_SET_MESSAGE              = "INVITE_USER_SET_MESSAGE"
export const INVITE_USER_SET_NAME                 = "INVITE_USER_SET_NAME"
export const INVITE_USER_SET_PHONE                = "INVITE_USER_SET_PHONE"
<<<<<<< HEAD
export const INVITE_USER_SET_CAN_MANAGE           = "INVITE_USER_SET_CAN_MANAGE"
export const INVITE_USER_SET_CAN_CREATE_OWN       = "INVITE_USER_SET_CAN_CREATE_OWN"
export const INVITE_USER_SET_CAN_CREATE_INTERNAL  = "INVITE_USER_SET_CAN_CREATE_INTERNAL"
export const INVITE_USER_SET_IS_INTERNAL          = "INVITE_USER_SET_IS_INTERNAL"
export const INVITE_USER_SET_ACCOUNT              = "INVITE_USER_SET_ACCOUNT"
export const INVITE_USER_SET_ACCOUNTS             = "INVITE_USER_SET_ACCOUNTS"
export const INVITE_USER_SET_ERROR                = "INVITE_USER_SET_ERROR"
export const INVITE_USER_SET_SUCCESS              = "INVITE_USER_SET_SUCCESS"
export const INVITE_USER_RESET_FORM               = "INVITE_USER_RESET_FORM"


=======

export const INVITE_USER_SET_CLIENT              = "INVITE_USER_SET_CLIENT"
export const INVITE_USER_SET_CLIENTS             = "INVITE_USER_SET_CLIENTS"
export const INVITE_USER_SET_GARAGE              = "INVITE_USER_SET_GARAGE"
export const INVITE_USER_SET_GARGES              = "INVITE_USER_SET_GARGES"
export const INVITE_USER_SET_CAR                 = "INVITE_USER_SET_CAR"
export const INVITE_USER_SET_CARS                = "INVITE_USER_SET_CARS"

export const INVITE_USER_SET_ERROR                = "INVITE_USER_SET_ERROR"
export const INVITE_USER_SET_SUCCESS              = "INVITE_USER_SET_SUCCESS"
export const INVITE_USER_RESET_FORM               = "INVITE_USER_RESET_FORM"
export const INVITE_USER_SET_CURRENT_EMAIL        = "INVITE_USER_SET_CURRENT_EMAIL"


export function setBooleanAttr (attr, value){
  return { type: INVITE_USER_BOOLEAN_ATTR
         , value
         , attribute: attr
         }
}

>>>>>>> feature/new_api
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

<<<<<<< HEAD
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
=======
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

export function setGarage (value){
  return { type: INVITE_USER_SET_GARAGE
         , value
         }
}
export function setGarages (value){
  return { type: INVITE_USER_SET_GARGES
         , value
         }
}

export function setCar (value){
  return { type: INVITE_USER_SET_CAR
         , value
         }
}
export function setCars (value){
  return { type: INVITE_USER_SET_CARS
         , value
         }
>>>>>>> feature/new_api
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
<<<<<<< HEAD
=======
export function setCurrentEmail (email){
  return  { type: INVITE_USER_SET_CURRENT_EMAIL
          , value: email
          }
}
>>>>>>> feature/new_api

export function resetForm (){
  return  { type: INVITE_USER_RESET_FORM }
}


<<<<<<< HEAD


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

=======
export function initManagebles () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {

      const clients = response.data.manageble_clients.map((client) => {return client.client})
      const garages = response.data.manageble_garages.map((garage) => {return garage.garage})
      const cars    = response.data.manageble_cars.map((car) => {return car.car})

      clients.unshift({id: undefined, name:  t(['inviteUser', 'selectClient'])})
      garages.unshift({id: undefined, name:  t(['inviteUser', 'selectGarage'])})
      cars.unshift(   {id: undefined, model: t(['inviteUser', 'selectCar'])})

      dispatch(setClients(clients))
      dispatch(setGarages(garages))
      dispatch(setCars(cars))
    }

    request (onSuccess, INIT_MANAGEBLES)
  }
}


>>>>>>> feature/new_api
export function dismissModal () {
  return (dispatch, getState) => {
    dispatch(setError( undefined ))
    dispatch(setSuccess( undefined ))
  }
}

<<<<<<< HEAD
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
=======
export function createNewManagebles () {
  return (dispatch, getState) => {
    const state = getState().inviteUser

    const emails = state.email.value.match(/\b[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}\b/g) //parse emails from coma separated string
    var unsucessfull = []

    const emailsSend = () => { // after invitations
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
          unsucessfull.push(email)
          onSuccess(undefined)
        }else{

          request( onSuccess
                 , ADD_MANAGEBLES
                 , { user_id: response.data.user_by_email.id
                   , client_user: { client_id: +state.client_id
                                  , admin: state.client_admin
                                  , secretary: state.client_secretary
                                  , host: state.client_host
                                  , internal: state.client_internal
                                  , message: ["clientInvitationMessage", state.clients.find((client)=>{return client.id == state.client_id}).name].join(';')
                                  , custom_message: state.message
                                  }
                   , user_garage: { garage_id: +state.garage_id
                                  , admin: state.garage_admin
                                  , receptionist: state.garage_receptionist
                                  , security: state.garage_security
                                  , message: ["garageInvitationMessage", state.garages.find((garage)=>{return garage.id == state.garage_id}).name].join(';')
                                  , custom_message: state.message
                                  }
                   , user_car: { car_id: +state.car_id
                               , admin: state.car_admin
                               , message: ["carInvitationMessage", state.cars.find((car)=>{return  car.id == state.car_id}).model].join(';')
                               , custom_message: state.message
                               }
                   }
                 )
        }
      }

      dispatch(setCurrentEmail(email))
      request (onUserExists
              , USER_AVAILABLE
              , {user: { email:     email.toLowerCase()
                       , full_name: state.full_name
                       , phone:     state.phone
                       , message:   state.message
                       }
                }
              )
    })
>>>>>>> feature/new_api
  }
}

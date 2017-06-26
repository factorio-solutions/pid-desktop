import { request } from '../helpers/request'
// import * as nav    from '../helpers/navigation'
import { t }       from '../modules/localization/localization'

import { USER_AVAILABLE, ADD_CLIENT_USER, ADD_GARAGE_USER, ADD_CAR_USER, INIT_MANAGEBLES } from '../queries/inviteUser.queries'

export const INVITE_USER_BOOLEAN_ATTR             = "INVITE_USER_BOOLEAN_ATTR"
export const INVITE_USER_SET_EMAIL                = "INVITE_USER_SET_EMAIL"
export const INVITE_USER_SET_MESSAGE              = "INVITE_USER_SET_MESSAGE"
export const INVITE_USER_SET_NAME                 = "INVITE_USER_SET_NAME"
export const INVITE_USER_SET_PHONE                = "INVITE_USER_SET_PHONE"

export const INVITE_USER_SET_CLIENT              = "INVITE_USER_SET_CLIENT"
export const INVITE_USER_SET_CLIENTS             = "INVITE_USER_SET_CLIENTS"
export const INVITE_USER_SET_GARAGE              = "INVITE_USER_SET_GARAGE"
export const INVITE_USER_SET_GARGES              = "INVITE_USER_SET_GARGES"
export const INVITE_USER_SET_CAR                 = "INVITE_USER_SET_CAR"
export const INVITE_USER_SET_CARS                = "INVITE_USER_SET_CARS"

export const INVITE_USER_SET_ERROR                = "INVITE_USER_SET_ERROR"
export const INVITE_USER_SET_SUCCESS              = "INVITE_USER_SET_SUCCESS"
export const INVITE_USER_RESET_FORM               = "INVITE_USER_RESET_FORM"
export const INVITE_USER_SET_HIGHLIGHT            = "INVITE_USER_SET_HIGHLIGHT"
export const INVITE_USER_SET_CURRENT_EMAIL        = "INVITE_USER_SET_CURRENT_EMAIL"


export function setBooleanAttr (attr, value){
  return { type: INVITE_USER_BOOLEAN_ATTR
         , value
         , attribute: attr
         }
}

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

export function setHighlight (value){
  return { type: INVITE_USER_SET_HIGHLIGHT
         , value
         }
}

export function toggleHighlight (){
  return (dispatch, getState) => {
    dispatch(setHighlight(!getState().inviteUser.highlight))
  }
}


export function resetForm (){
  return  { type: INVITE_USER_RESET_FORM }
}


export function initManagebles () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      const clients = response.data.client_users.filter(cu => {
        return cu.user_id === response.data.current_user.id && (cu.admin || cu.secretary || cu.internal)
      }).map(cu => {
        return {...cu.client, admin: cu.admin, secretary: cu.secretary, internal: cu.internal}
      })
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


export function dismissModal () {
  return (dispatch, getState) => {
    dispatch(setError( undefined ))
    dispatch(setSuccess( undefined ))
  }
}

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
          const clientUserPromise = new Promise(function(resolve, reject) {
            if (state.client_id){
              const onClientSuccess = (response) => {
                resolve(response.data)
              }

              request( onClientSuccess
                     , ADD_CLIENT_USER
                     , { user_id: response.data.user_by_email.id
                       , client_user: { client_id: +state.client_id
                                      , admin: state.client_admin
                                      , secretary: state.client_secretary
                                      , host: state.client_host
                                      , internal: state.client_internal
                                      , message: ["clientInvitationMessage", state.clients.find((client)=>{return client.id == state.client_id}).name].join(';')
                                      , custom_message: state.message
                                      }
                       }
                     )
            } else {
              resolve(undefined)
            }
          })

          const userGaragePromise = new Promise(function(resolve, reject) {
            if (state.garage_id){
              const onGarageSuccess = (response) => {
                resolve(response.data)
              }

              request( onGarageSuccess
                     , ADD_GARAGE_USER
                     , { user_id: response.data.user_by_email.id
                       , user_garage: { garage_id: +state.garage_id
                                      , admin: state.garage_admin
                                      , receptionist: state.garage_receptionist
                                      , security: state.garage_security
                                      , message: ["garageInvitationMessage", state.garages.find((garage)=>{return garage.id == state.garage_id}).name].join(';')
                                      , custom_message: state.message
                                      }
                       }
                     )
            } else {
              resolve(undefined)
            }
          })

          const userCarPromise = new Promise(function(resolve, reject) {
            if (state.car_id){
              const onCarSuccess = (response) => {
                resolve(response.data)
              }

              request( onCarSuccess
                     , ADD_CAR_USER
                     , { user_id: response.data.user_by_email.id
                       , user_car: { car_id: +state.car_id
                                   , admin: state.car_admin
                                   , message: ["carInvitationMessage", state.cars.find((car)=>{return  car.id == state.car_id}).model].join(';')
                                   , custom_message: state.message
                                   }
                       }
                    )
            } else {
              resolve(undefined)
            }
          })

          Promise.all([clientUserPromise, userGaragePromise, userCarPromise]).then((value)=>{
            onSuccess(undefined)
          })

          // request( onSuccess
          //        , ADD_MANAGEBLES
          //        , { user_id: response.data.user_by_email.id
          //          , client_user: { client_id: +state.client_id
          //                         , admin: state.client_admin
          //                         , secretary: state.client_secretary
          //                         , host: state.client_host
          //                         , internal: state.client_internal
          //                         , message: ["clientInvitationMessage", state.clients.find((client)=>{return client.id == state.client_id}).name].join(';')
          //                         , custom_message: state.message
          //                         }
          //          , user_garage: { garage_id: +state.garage_id
          //                         , admin: state.garage_admin
          //                         , receptionist: state.garage_receptionist
          //                         , security: state.garage_security
          //                         , message: ["garageInvitationMessage", state.garages.find((garage)=>{return garage.id == state.garage_id}).name].join(';')
          //                         , custom_message: state.message
          //                         }
          //          , user_car: { car_id: +state.car_id
          //                      , admin: state.car_admin
          //                      , message: ["carInvitationMessage", state.cars.find((car)=>{return  car.id == state.car_id}).model].join(';')
          //                      , custom_message: state.message
          //                      }
          //          }
          //        )
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
  }
}

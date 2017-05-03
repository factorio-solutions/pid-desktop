import { request }  from '../helpers/request'
import * as nav     from '../helpers/navigation'

import { GET_CURRENT_USER, UPDATE_CURRENT_USER } from '../queries/pageBase.queries.js'


export const EDIT_USER_SET_NAME =  "EDIT_USER_SET_NAME"
// export const EDIT_USER_SET_EMAIL = "EDIT_USER_SET_EMAIL"
export const EDIT_USER_SET_PHONE = "EDIT_USER_SET_PHONE"


export function setName (value,valid) {
  return { type: EDIT_USER_SET_NAME
         , value: {value, valid}
         }
}

// export function setEmail (value,valid) {
//   return { type: EDIT_USER_SET_EMAIL
//          , value: {value, valid}
//          }
// }

export function setPhone (value,valid) {
  return { type: EDIT_USER_SET_PHONE
         , value: {value, valid}
         }
}


export function initUser () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setName(response.data.current_user.full_name, true))
      // dispatch(setEmail(response.data.current_user.email, true))
      dispatch(setPhone(response.data.current_user.phone, true))
    }

    request(onSuccess, GET_CURRENT_USER)
  }
}

export function submitUser() {
  return (dispatch, getState) => {
    const state = getState().editUser
    const currentUserId = getState().pageBase.current_user.id

    const onSuccess = (response) => {
      nav.to('/settings')
    }

    request(onSuccess
           , UPDATE_CURRENT_USER
           , { id: currentUserId
             , user: { full_name: state.name.value
                    //  , email: state.email.value
                     , phone: state.phone.value
                     }
             }
           )
  }
}

import { request } from '../helpers/request'

export const USERS_SET_USERS = 'USERS_SET_USERS'

import { GET_KNOWN_USERS }  from '../queries/users.queries'


export function setUsers (users){
  return  { type: USERS_SET_USERS
          , value: users
          }
}


export function initUsers() {
  return (dispatch, getState) => {

    const onSuccess = (response) => {
      var users = transformUsers([], response.data.client_users, false)
      users = transformUsers(users, response.data.pending_client_users, true)

      dispatch(setUsers( users ))
    }

    request(onSuccess, GET_KNOWN_USERS)
  }
}

function transformUsers (initArray,client_users, pending) {
  return client_users.reduce((users, client_user)=>{
    var index = users.findIndex((user)=>{return user.id == client_user.user.id})
    if (index == -1) {
      client_user.user.pending = pending
      !pending ? client_user.user.clients = [client_user.client] : client_user.user.clients = []
      users.push(client_user.user)
    } else {
      client_user.client && users[index].clients.push(client_user.client)
    }

    return users
  }, initArray)
}

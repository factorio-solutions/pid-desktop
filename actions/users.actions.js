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
<<<<<<< HEAD
      var users = transformUsers([], response.data.account_users, false)
      users = transformUsers(users, response.data.pending_account_users, true)
=======
      var users = transformUsers([], response.data.client_users.filter((client_user) => {return !client_user.pending}), false)
      users = transformUsers(users, response.data.client_users.filter((client_user) => {return client_user.pending}), true)
>>>>>>> feature/new_api

      dispatch(setUsers( users ))
    }

    request(onSuccess, GET_KNOWN_USERS)
  }
}

<<<<<<< HEAD
function transformUsers (initArray,account_users, pending) {
  return account_users.reduce((users, account_user)=>{
    var index = users.findIndex((user)=>{return user.id == account_user.user.id})
    if (index == -1) {
      account_user.user.pending = pending
      !pending ? account_user.user.accounts = [account_user.account] : account_user.user.accounts = []
      users.push(account_user.user)
    } else {
      account_user.account && users[index].accounts.push(account_user.account)
=======
function transformUsers (initArray,client_users, pending) {
  return client_users.reduce((users, client_user)=>{
    var index = users.findIndex((user)=>{return user.id == client_user.user.id})
    if (index == -1) {
      client_user.user.pending = pending
      !pending ? client_user.user.clients = [client_user.client] : client_user.user.clients = []
      users.push(client_user.user)
    } else {
      client_user.client && users[index].clients.push(client_user.client)
>>>>>>> feature/new_api
    }

    return users
  }, initArray)
}

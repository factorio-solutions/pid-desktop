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
      var users = transformUsers([], response.data.account_users, false)
      users = transformUsers(users, response.data.pending_account_users, true)

      dispatch(setUsers( users ))
    }

    request(onSuccess, GET_KNOWN_USERS)
  }
}

function transformUsers (initArray,account_users, pending) {
  return account_users.reduce((users, account_user)=>{
    var index = users.findIndex((user)=>{return user.id == account_user.user.id})
    if (index == -1) {
      account_user.user.pending = pending
      !pending ? account_user.user.accounts = [account_user.account] : account_user.user.accounts = []
      users.push(account_user.user)
    } else {
      account_user.account && users[index].accounts.push(account_user.account)
    }

    return users
  }, initArray)
}

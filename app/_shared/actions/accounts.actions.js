import { request } from '../helpers/request'
import _           from 'lodash'

import { GET_ACCOUNTS } from '../queries/accounts.queries'

export const SET_ACCOUNTS = "SET_GARAGES"


export function setAccounts (accounts){
  return  { type: SET_ACCOUNTS
          , value: accounts
          }
}


export function initAccounts (){
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      var current_user_id = response.data.current_user.id
      var uniqueAccounts = _.uniqWith(response.data.account_users.map(function (account_users) {return account_users.account}),  _.isEqual)
      var managebleAccountIds = response.data.account_users
                                .filter((account_user) => {return account_user.user_id == current_user_id && account_user.can_manage })
                                .map(function (account_users) {return account_users.account.id})

      uniqueAccounts.map((account) => {
        managebleAccountIds.includes(account.id) ? account.can_manage = true : account.can_manage = false
        return account
      })

      dispatch( setAccounts( uniqueAccounts ) )
    }
    request(onSuccess, GET_ACCOUNTS)
  }
}

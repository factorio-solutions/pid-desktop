import { request } from '../helpers/request'

import { GET_ACCOUNTS } from '../queries/accounts.queries'


export const ACCOUNTS_SET_ACCOUNTS = "ACCOUNTS_SET_ACCOUNTS"


export function setAccounts (value) {
  return { type: ACCOUNTS_SET_ACCOUNTS
         , value
         }
}

export function initAccounts () {
  return (dispatch, getState) => {
    const onSuccess = (response) => {
      dispatch(setAccounts(response.data.accounts))
    }
    
    request(onSuccess, GET_ACCOUNTS)
  }
}

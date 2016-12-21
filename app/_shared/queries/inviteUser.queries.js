// get available users for AccountUsers
export const USER_AVAILABLE = `query UserByEmail($user: UserInput!, $account_id: Id!) {
  user_by_email(user: $user, account_id: $account_id) {
    id
  }
}
`

// create accountUser connection
export const ADD_ACCOUNTUSER = `mutation createPendingAccountUser($pending_account_user: PendingAccountUserInput!, $user_id: Id!, $account_id: Id!) {
  create_pending_account_user(pending_account_user: $pending_account_user, user_id: $user_id, account_id: $account_id) {
    id
  }
}
`

// get manageble accounts
export const INIT_ACCOUNTS = `{
  manageble_accounts {
    name
    id
    created_at
  }
}
`

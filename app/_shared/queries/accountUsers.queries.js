// get users of account id
export const GET_ACCOUNTUSERS = `query ($id: Id!) {
  account_users(account_id: $id) {
    user {
      id
      full_name
      email
      phone
    }
    account {
      id
      name
    }
    can_manage
    can_create_own
    can_create_internal
    is_internal
    created_at
  }
  pending_account_users(account_id: $id) {
    user {
      id
      full_name
      email
      phone
    }
  }
}
`

// update user account relationship
export const UPDATE_ACCOUNTUSERS = `mutation accountUserMutation($account_user: AccountUserInput!, $user_id: Id!, $account_id: Id!) {
  update_account_user(account_user: $account_user, user_id: $user_id, account_id: $account_id) {
    account_id
    user_id
  }
}
`

// destroy account user relationship
export const DESTROY_ACCOUNTUSERS = `mutation accountUserMuation($account_id: Id!, $user_id: Id!) {
  destroy_account_user(account_id: $account_id, user_id: $user_id) {
    account_id
    user_id
  }
}
`

// get available users for AccountUsers
// export const USER_AVAILABLE = 'query UserByEmail($email:String!, $account_id: Id!){ user_by_email(email: $email, account_id: $account_id){ id } }'
export const USER_AVAILABLE = 'query UserByEmail($user:UserInput!, $account_id: Id!){ user_by_email(user: $user, account_id: $account_id){ id } }'

// create accountUser connection
// export const ADD_ACCOUNTUSER = 'mutation accountUserMutation($account_user: AccountUserInput!, $user_id: Id!, $account_id: Id!) { create_account_user(account_user: $account_user, user_id: $user_id, account_id: $account_id) { account_id } }'
// export const ADD_ACCOUNTUSER = "mutation Mut ($notification: NotificationInput!){create_notification(notification:$notification){id}}"
// export const ADD_ACCOUNTUSER = "mutation createPendingAccountUser($account_user: AccountUserInput!, $user_id: Id!, $account_id: Id!) {create_account_user(account_user: $account_user, user_id: $user_id, account_id: $account_id) {account_id}}"
export const ADD_ACCOUNTUSER = "mutation createPendingAccountUser($pending_account_user: PendingAccountUserInput!, $user_id: Id!, $account_id: Id!) {create_pending_account_user(pending_account_user: $pending_account_user, user_id: $user_id, account_id: $account_id) {id}}"


export const INIT_ACCOUNTS = 'query{ manageble_accounts { name, id, created_at } }'

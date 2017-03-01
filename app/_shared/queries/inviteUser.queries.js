<<<<<<< HEAD
// get available users for AccountUsers
// export const USER_AVAILABLE = 'query UserByEmail($email:String!, $account_id: Id!){ user_by_email(email: $email, account_id: $account_id){ id } }'
export const USER_AVAILABLE = 'query UserByEmail($user:UserInput!, $account_id: Id!){ user_by_email(user: $user, account_id: $account_id){ id } }'

// create accountUser connection
// export const ADD_ACCOUNTUSER = 'mutation accountUserMutation($account_user: AccountUserInput!, $user_id: Id!, $account_id: Id!) { create_account_user(account_user: $account_user, user_id: $user_id, account_id: $account_id) { account_id } }'
// export const ADD_ACCOUNTUSER = "mutation Mut ($notification: NotificationInput!){create_notification(notification:$notification){id}}"
// export const ADD_ACCOUNTUSER = "mutation createPendingAccountUser($account_user: AccountUserInput!, $user_id: Id!, $account_id: Id!) {create_account_user(account_user: $account_user, user_id: $user_id, account_id: $account_id) {account_id}}"
export const ADD_ACCOUNTUSER = "mutation createPendingAccountUser($pending_account_user: PendingAccountUserInput!, $user_id: Id!, $account_id: Id!) {create_pending_account_user(pending_account_user: $pending_account_user, user_id: $user_id, account_id: $account_id) {id}}"


export const INIT_ACCOUNTS = 'query{ manageble_accounts { name, id, created_at } }'
=======
// get available users for ClientUsers
export const USER_AVAILABLE = `query UserByEmail($user: UserInput!) {
  user_by_email(user: $user) {
    id
  }
}
`

// create Managebles connection
export const ADD_MANAGEBLES = `mutation UserCarMutation($user_id:Id!, $client_user: ClientUserInput, $user_garage: UserGarageInput, $user_car: UserCarInput) {
  create_client_user(user_id:$user_id, client_user: $client_user){
    id
  }
  create_user_garage(user_id:$user_id, user_garage: $user_garage){
  	id
  }
  create_user_car(user_id:$user_id, user_car: $user_car) {
    id
  }
}
`

// get manageble clients
export const INIT_MANAGEBLES = `{
  manageble_clients {
    client{
      id
      name
    }
  }
  manageble_cars{
    car{
      id
      model
    }
  }
  manageble_garages{
    garage{
      id
      name
    }
  }
}
`
>>>>>>> feature/new_api

// get available users for ClientUsers
export const USER_AVAILABLE = `query UserByEmail($user: UserInput!, $client_id: Id!) {
  user_by_email(user: $user, client_id: $client_id) {
    id
  }
}
`

// create clientUser connection
export const ADD_CLIENTUSER = `mutation createPendingClientUser($pending_client_user: PendingClientUserInput!, $user_id: Id!, $client_id: Id!) {
  create_pending_client_user(pending_client_user: $pending_client_user, user_id: $user_id, client_id: $client_id) {
    id
  }
}
`

// get manageble clients
export const INIT_CLIENTS = `{
  manageble_clients {
    name
    id
    created_at
  }
}
`

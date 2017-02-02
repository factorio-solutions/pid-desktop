// get users of client id
export const GET_CLIENTUSERS = `query ($id: Id!) {
  client_users(client_id: $id) {
    user {
      id
      full_name
      email
      phone
    }
    client {
      id
      name
    }
    admin
    host
    secretary
    pending
    internal
    created_at
  }
}
`

// update user client relationship
export const UPDATE_CLIENTUSERS = `mutation clientUserMutation($client_user: ClientUserInput!, $user_id: Id!, $client_id: Id!) {
  update_client_user(client_user: $client_user, user_id: $user_id, client_id: $client_id) {
    client_id
    user_id
  }
}
`

// destroy client user relationship
export const DESTROY_CLIENTUSERS = `mutation clientUserMuation($client_id: Id!, $user_id: Id!) {
  destroy_client_user(client_id: $client_id, user_id: $user_id) {
    client_id
    user_id
  }
}
`

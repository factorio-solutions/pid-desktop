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
    can_manage
    can_create_own
    can_create_internal
    is_internal
    created_at
  }
  pending_client_users(client_id: $id) {
    user {
      id
      full_name
      email
      phone
    }
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

// fetches all known users from all clients
export const GET_KNOWN_USERS = `{
  client_users {
    client {
      id
      name
      created_at
    }
    user {
      id
      full_name
      email
      phone
      last_active
    }
  }
  pending_client_users {
    user {
      id
      full_name
      email
      phone
      last_active
    }
  }
}
`

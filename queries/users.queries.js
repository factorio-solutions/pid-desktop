// fetches all known users from all clients
export const GET_KNOWN_USERS = `{
  client_users {
    pending
    created_at
    admin
    secretary
    internal
    host
    client {
      id
      name
    }
    user {
      id
      full_name
      email
      phone
      last_active
    }
  }
  user_garages{
    pending
    created_at
    admin
    security
    receptionist
    garage{
      name
      id
    }
    user {
      id
      full_name
      email
      phone
      last_active
    }
  }
  user_cars{
    pending
    created_at
    admin
    car{
      model
      id
    }
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

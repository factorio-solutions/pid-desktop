// fetch all clients
export const GET_CLIENTS = `{
  current_user {
    id
  }
  client_users {
    client_id
    user_id
    admin
    client {
      name
      token
      id
      created_at
      user_count
      contracts{
        name
        id
      }
    }
  }
}
`

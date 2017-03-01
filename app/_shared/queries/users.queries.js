<<<<<<< HEAD
// fetches all known users from all accounts
export const GET_KNOWN_USERS = 'query { account_users{account{id, name, created_at} user{ id, full_name, email, phone, last_active } }, pending_account_users{ user{ id, full_name, email, phone, last_active } } }'
=======
// fetches all known users from all clients
export const GET_KNOWN_USERS = `{
  client_users {
    pending
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
}
`
>>>>>>> feature/new_api

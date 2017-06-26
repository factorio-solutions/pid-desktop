
export const GET_CURRENT_USER = `{
  current_user {
    full_name
    id
    email
    phone
    hint
    garage_admin
    receptionist
    security
    client_admin
    secretary
    has_garages
    has_account
    has_client
    created_at
  }
}
`

// update UserSettings
export const UPDATE_CURRENT_USER = `mutation UpdateUser($user: UserInput!, $id: Id!) {
  update_user(user: $user, id: $id) {
    full_name
    id
    email
    phone
    hint
    garage_admin
    receptionist
    security
    client_admin
    secretary
    has_garages
    has_account
    has_client
  }
}
`

// get user available garages
export const GET_GARAGES = `{
  current_user {
    id
  }
  user_garages {
    admin
    receptionist
    security
    pending
    user_id
    garage {
      id
      active_pid_tarif_id
      name
      img
    }
  }
}
`

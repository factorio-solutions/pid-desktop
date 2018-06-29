
export const GET_CURRENT_USER = `{
  current_user {
    language
    full_name
    pid_admin
    id
    email
    phone
    hint
    intercom_user_hash
    garage_admin
    receptionist
    security
    client_admin
    secretary
    has_garages
    has_account
    has_client
    created_at
    hide_public_garages
    csob_payment_templates{
      merchant_id
    }
  }
}
`

// update UserSettings
export const UPDATE_CURRENT_USER = `mutation UpdateUser($user: UserInput!, $id: Id!) {
  update_user(user: $user, id: $id) {
    full_name
    pid_admin
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
    hide_public_garages
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
    manager
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

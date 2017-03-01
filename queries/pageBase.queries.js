<<<<<<< HEAD
// Get currently logged in user
export const GET_CURRENT_USER = "{ current_user { full_name, id, email, phone, hint, braintree_token } }"

// update UserSettings
export const UPDATE_CURRENT_USER = "mutation UpdateUser($user: UserInput!, $id: Id!) { update_user(user: $user, id: $id){ full_name, id, email, phone, hint } }"
=======

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
>>>>>>> feature/new_api

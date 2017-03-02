// get current user
export const GET_CURRENT_USER = `{
  current_user {
    full_name
    id
    email
    phone
  }
}
`

// Get available garages
export const GET_RESERVABLE_GARAGES = `query Query($user_id: Id!) {
  reservable_garages(user_id: $user_id) {
    id
    name
  }
}
`
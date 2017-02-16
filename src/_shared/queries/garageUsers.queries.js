// get users of client id
export const GET_GARAGEUSERS = `query ($id: Id!) {
  user_garages(garage_id: $id) {
    user {
      id
      full_name
      email
      phone
    }
    garage {
      id
      name
    }
    admin
    receptionist
    security
    pending
    created_at
  }
}
`

// update user client relationship
export const UPDATE_GARAGEUSERS = `mutation userGarageMutation($user_garage: UserGarageInput!, $user_id: Id!, $garage_id: Id!) {
  update_user_garage(user_garage: $user_garage, user_id: $user_id, garage_id: $garage_id) {
    garage_id
    user_id
  }
}
`

// destroy client user relationship
export const DESTROY_GARAGEUSERS = `mutation clientUserMuation($garage_id: Id!, $user_id: Id!) {
  destroy_user_garage(garage_id: $garage_id, user_id: $user_id) {
    garage_id
    user_id
  }
}
`

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
      is_time_credit_active
      time_credit_amount_per_month
    }
    admin
    host
    secretary
    pending
    internal
    contact_person
    created_at
    current_time_credit_amount
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

// Resend invitation email
export const RESEND_INVITATION = `mutation resendInvitation($user_id: Id!, $client_id: Id, $car_id: Id, $garage_id: Id) {
  resend_invitation(user_id: $user_id, client_id: $client_id, car_id: $car_id, garage_id: $garage_id)
}
`

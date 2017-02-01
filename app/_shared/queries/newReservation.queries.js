//  get available users for this reservation form
export const GET_AVAILABLE_USERS = `{
  reservable_users {
    id
    full_name
  }
}
`

// get available garages for this reservation form
export const GET_AVAILABLE_GARAGES = `query Query($user_id: Id!) {
  reservable_garages(user_id: $user_id) {
    id
    name
  }
}`

// get floors of garage of specified id
export const GET_AVAILABLE_FLOORS = `query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $user_id: Id!) {
  garage(id: $id) {
    floors {
      id
      label
      scheme
      free_places(begins_at: $begins_at, ends_at: $ends_at, user_id: $user_id) {
        id
        label
        floor_id
        client_places {
          client_id
        }
      }
    }
  }
}
`

// create reservation mutation
export const CREATE_RESERVATION = `mutation reservationMuation($reservation: ReservationInput!) {
  create_reservation(reservation: $reservation) {
    id
  }
}
`

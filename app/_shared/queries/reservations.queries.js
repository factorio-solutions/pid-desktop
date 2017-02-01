// get all reservations
export const GET_RESERVATIONS_QUERY = `{
  reservations {
    id
    client {
      name
    }
    created_at
    creator {
      full_name
      email
    }
    user {
      full_name
    }
    place {
      label
      floor {
        label
        garage {
          name
          id
        }
      }
    }
    begins_at
    ends_at
  }
}
`

// destroy reservation
export const DESTROY_RESERVATION = `mutation reservationMuation($id: Id!) {
  destroy_reservation(id: $id) {
    id
  }
}
`

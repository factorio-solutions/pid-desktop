
export const OCCUPANCY_GARAGES_QUERY = `query OccupancyGarages {
  occupancy_garages {
    id
    name
    img
  }
}
`

export const GARAGE_DETAILS_QUERY = `query OccupancyGarage($id: Id!, $from: Datetime!, $to: Datetime!, $client_ids: [Id]) {
  garage(id: $id) {
    id
    name
    clients{
      name
      id
    }
    user_garage {
      admin
      receptionist
      security
      manager
    }
    contracts_in_interval(from: $from, to: $to, client_ids: $client_ids) {
      id
      places {
        id
      }
    }
    reservations_in_interval(from: $from, to: $to) {
      id
      reservation_case
      client {
        name
        id
        client_user {
          admin
          secretary
          internal
          host
        }
      }
      car {
        licence_plate
      }
      begins_at
      ends_at
      approved
      user {
        id
        full_name
        email
        phone
      }
      place {
        id
      }
    }
    floors {
      id
      label
      occupancy_places {
        id
        label
      }
    }
  }
}
`

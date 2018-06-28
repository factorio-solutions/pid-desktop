
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
    user_garage {
      admin
      receptionist
      security
      manager
    }
    floors {
      id
      label
      occupancy_places {
        id
        label
        contracts_in_interval(from: $from, to: $to, client_ids: $client_ids) {
          id
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
        }
      }
    }
  }
}
`

export const GARAGE_CLIENTS_QUERY = `query Garage($id: Id!) {
  garage(id: $id) {
    clients{
      name
      id
    }
  }
}
`

export const GET_AVAILABLE_CLIENTS = `query Query($user_id: Id, $garage_id: Id) {
  reservable_clients(user_id: $user_id, garage_id: $garage_id) {
    id
  }
}
`

export const CHECK_PLACE_AVAILABLE = `query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $client_ids: [Id]) {
  garage(id: $id) {
    floors {
      free_places(begins_at: $begins_at, ends_at: $ends_at, client_ids: $client_ids, user_id: -1) {
        id
      }
    }
  }
}
`

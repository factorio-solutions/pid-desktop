
export const OCCUPANCY_GARAGES_QUERY = `query OccupancyGarages {
  occupancy_garages {
    id
    name
    img
  }
  current_user {
    id
    occupancy_client_filter
    occupancy_duration
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

export const GARAGE_CLIENTS_QUERY = `query Garage($id: Id!) {
  garage(id: $id) {
    clients {
      name
      id
    }
  }
}
`

export const UPDATE_USERS_SETTINGS = `mutation UpdateUser($id:Id!, $user: UserInput!) {
  update_user(id:$id, user: $user) {
    id
  }
}
`

export const GET_AVAILABLE_CLIENTS = `query Query($user_id: Id, $garage_id: Id) {
  reservable_clients(user_id: $user_id, garage_id: $garage_id) {
    id
  }
  current_user {
    secretary_clients {
      id
    }
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

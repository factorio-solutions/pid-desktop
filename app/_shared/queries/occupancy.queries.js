// get available clients and garages
export const OCCUPANCY_INIT = `{
  manageble_clients {
    name
    id
    created_at
  }
  user_garages {
    garage {
      name
      id
    }
  }
}
`

// Get details about garage id: $id
export const GARAGE_DETAILS_QUERY = `query Garage($id: Id!) {
  garage(id: $id) {
    id
    name
    floors {
      label
      places {
        id
        label
        reservations {
          client {
            name
            id
          }
          begins_at
          ends_at
          creator {
            full_name
            email
            phone
          }
          user {
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

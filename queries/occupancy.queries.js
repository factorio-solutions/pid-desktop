// get available clients and garages
// manageble_clients {
//   name
//   id
//   created_at
// }
// export const OCCUPANCY_INIT = `{
//   user_garages {
//     garage {
//       clients{
//         name
//         id
//       }
//     }
//   }
// }
// `

// Get details about garage id: $id
// client {
//   name
//   id
// }
export const GARAGE_DETAILS_QUERY = `query OccupancyGarages($from: Datetime!, $to: Datetime!, $client_ids: [Id]) {
  occupancy_garages {
    id
    name
    user_garage{
      admin
      receptionist
      security
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
            client_user{
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

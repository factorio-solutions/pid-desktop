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
          id
          client{
            name
          }
          car{
            licence_plate
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
    clients{
      name
      id
    }
  }
}
`

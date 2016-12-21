// Will fetch all garages, their name, id and datetime of creation
export const GET_GARAGES = `{
  user_garages {
    garage {
      name
      created_at
      id
      place_count
      address
    }
  }
}
`

// remove Garage of id
export const DESTROY_GARAGE = `mutation reservationMuation($id: Id!) {
  destroy_garage(id: $id) {
    id
  }
}
`

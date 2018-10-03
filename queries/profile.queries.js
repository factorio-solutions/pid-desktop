// fetch all clients
export const GET_CURRENT_USER = `query {
  current_user {
    id
    full_name
    email
    phone
    language
    created_at
    user_cars{
      admin
      car {
        id
        color
        model
        name
        licence_plate
      }
    }
    client_users{
      pending
      admin
      secretary
      internal
      host
      created_at
      client {
        id
        name
      }
    }
    user_garages{
      pending
      admin
      security
      receptionist
      manager
      garage{
        name
        id
        documents{
          id
          name
          updated_at
          lang
          url
          doc_type
        }
      }
    }
  }
}
`

export const GET_CARS = `query {
  current_user {
    user_cars{
      admin
      car {
        id
        color
        model
        name
        licence_plate
      }
    }
  }
}
`

// destroy cars
export const DESTROY_CAR = `mutation destroyCar($id: Id!) {
  destroy_car(id: $id) {
    id
  }
}
`

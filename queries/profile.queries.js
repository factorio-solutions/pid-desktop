// fetch all clients
export const GET_CARS = `query { user_cars {
    admin
		car{
      id
      color
      model
      licence_plate
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

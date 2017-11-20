// fetch all clients
export const GET_CARS = `query ($user_id: Id) {
  user_cars(user_id: $user_id) {
    user_id
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
`

// destroy cars
export const DESTROY_CAR = `mutation destroyCar($id: Id!) {
  destroy_car(id: $id) {
    id
  }
}
`

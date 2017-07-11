// will create new car
export const CREATE_NEW_CAR = `mutation cartMutations($car: CarInput!) {
  create_car(car: $car) {
    id
  }
}
`

//fetches car details
export const EDIT_CAR_INIT = `query ($id: Id!) {
  user_cars(car_id: $id) {
		car{
      color
      model
      licence_plate
      width
      height
      length
      lpg
    }
  }
}
`

// edit car
export const EDIT_CAR_MUTATION = `mutation mutateCar($car: CarInput!, $id: Id!) {
  update_car(car: $car, id: $id) {
    id
  }
}
`

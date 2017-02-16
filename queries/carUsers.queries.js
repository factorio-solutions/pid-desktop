// get users of car id
export const GET_CARUSERS = `query ($id: Id!) {
  current_user{
    id
  }
  user_cars(car_id: $id) {
    user {
      id
      full_name
      email
      phone
    }
    car {
      id
      licence_plate
    }
    admin
    pending
    created_at
  }
}
`

// update user client relationship
export const UPDATE_CARUSERS = `mutation carUserMutation($user_car: UserCarInput!, $user_id: Id!, $car_id: Id!) {
  update_user_car(user_car: $user_car, user_id: $user_id, car_id: $car_id) {
    car_id
    user_id
  }
}
`

// destroy client user relationship
export const DESTROY_CARUSERS = `mutation carUserMutation($user_id: Id!, $car_id: Id!) {
  destroy_user_car(user_id: $user_id, car_id: $car_id) {
    car_id
    user_id
  }
}
`

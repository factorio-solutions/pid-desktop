//  get available users for this reservation form
// available users are current user + if(secretary){secretary.clients.users} + if(receptionist){receptionist.createdReservations.users}
export const GET_AVAILABLE_USERS = `{
  reservable_users {
    id
    full_name
  }
}
`

// get available garages for this reservation form
export const GET_AVAILABLE_GARAGES = `query Query($user_id: Id) {
  reservable_garages(user_id: $user_id) {
    id
    name
  }
}
`

// get available garages for this reservation form
export const GET_AVAILABLE_CLIENTS = `query Query($user_id: Id, $garage_id: Id) {
  reservable_clients(user_id: $user_id, garage_id: $garage_id) {
    id
    name
  }
}
`

export const GET_AVAILABLE_CARS = `query Query($user_id: Id) {
  reservable_cars(user_id: $user_id) {
    id
    model
    licence_plate
  }
}
`

// getGaragePricing
export const GET_GARAGE_PRICINGS = `query ($id: Id!) {
  garage(id: $id) {
    id
    pricings{
      name
      flat_price
      exponential_12h_price
      exponential_day_price
      exponential_week_price
      exponential_month_price
      weekend_price
      currency{
        symbol
      }
      groups{
        place_id
      }
    }
  }
}
`

// get floors of garage of specified id
export const GET_GARAGE_DETAILS = `query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $user_id: Id, $client_id: Id) {
  garage(id: $id) {
    name
    floors {
      id
      label
      scheme
      places {
        id
        label
      }
      free_places(begins_at: $begins_at, ends_at: $ends_at, user_id: $user_id, client_id: $client_id) {
        id
        label
      }
    }
  }
}
`
// pricings{
//   name
//   flat_price
//   exponential_12h_price
//   exponential_day_price
//   exponential_week_price
//   exponential_month_price
//   weekend_price
//   currency{
//     symbol
//   }
// }

// create reservation mutation
export const CREATE_RESERVATION = `mutation createReservation($reservation: ReservationInput!, $user_id:Id!, $place_id:Id!) {
  create_reservation(reservation: $reservation, user_id: $user_id, place_id: $place_id) {
    id
    payment_url
  }
}
`

export const PAY_RESREVATION = `mutation PaypalPayReservation ($token:String, $id:Id) {
	paypal_pay_reservation(token: $token, id: $id) {
		id
    approved
	}
}`

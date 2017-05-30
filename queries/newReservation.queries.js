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
      flat_price
      exponential_12h_price
      exponential_day_price
      exponential_week_price
      exponential_month_price
      weekend_price
      place_id
      currency{
        symbol
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
        pricing{
          flat_price
          exponential_12h_price
          exponential_day_price
          exponential_week_price
          exponential_month_price
          weekend_price
          place_id
          currency{
            symbol
          }
        }
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
export const CREATE_RESERVATION = `mutation createReservation($reservation: ReservationInput!) {
  create_reservation(reservation: $reservation) {
    id
    payment_url
  }
}
`

// create reservation mutation
export const UPDATE_RESERVATION = `mutation updateReservation($reservation: ReservationInput!, $id:Id!) {
  update_reservation(reservation: $reservation, id: $id) {
    id
  }
}
`

export const PAY_RESREVATION = `mutation PaypalPayReservation ($token:String, $id:Id) {
	paypal_pay_reservation(token: $token, id: $id) {
		id
    approved
	}
}`


// get reservation details
export const GET_RESERVATION = `query getReservation($id: Id!) {
  reservation(id: $id) {
    id
    user_id
    car {
      id
      licence_plate
    }
    client_id
    place{
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
      }

      floor{
        id
        garage{
          id
        }
      }
    }
    begins_at
    ends_at
  }
}
`

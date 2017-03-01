//  get available users for this reservation form
<<<<<<< HEAD
export const GET_AVAILABLE_USERS = '{ reservable_users { id, full_name } }'

// get available garages for this reservation form
export const GET_AVAILABLE_GARAGES = 'query Query($user_id: Id!) {reservable_garages(user_id: $user_id) { id, name } }'

// get floors of garage of specified id
export const GET_AVAILABLE_FLOORS = 'query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $user_id: Id!) { garage(id: $id) { floors { id, label, scheme, free_places(begins_at: $begins_at, ends_at: $ends_at, user_id: $user_id) { id, label, floor_id, account_places { account_id } } } } }'

// create reservation mutation
export const CREATE_RESERVATION = 'mutation reservationMuation ($reservation: ReservationInput!){ create_reservation (reservation: $reservation){ id } }'
=======
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
      }
      free_places(begins_at: $begins_at, ends_at: $ends_at, user_id: $user_id, client_id: $client_id) {
        id
        label
      }
    }
  }
}
`

// create reservation mutation
export const CREATE_RESERVATION = `mutation createREservation($reservation: ReservationInput!, $user_id:Id!, $place_id:Id!) {
  create_reservation(reservation: $reservation, user_id: $user_id, place_id: $place_id) {
    id
  }
}
`

export const GET_BRAINTREE_TOKEN = `{
  current_user {
    braintree_token
  }
}
`
>>>>>>> feature/new_api

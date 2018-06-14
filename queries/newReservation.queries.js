//  get available users for this reservation form
// available users are current user + if(secretary){secretary.clients.users} + if(receptionist){receptionist.createdReservations.users}
export const GET_AVAILABLE_USERS = `{
  reservable_users {
    id
    full_name
    phone
    email
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
    has_sms_api_token
    is_sms_api_token_active
    is_secretary
    sms_templates {
      name
      template
    }
  }
  last_reservation_client(user_id: $user_id, garage_id: $garage_id){
    id
  }
}
`

export const GET_USER = `query Query($id: Id!) {
  user(id: $id) {
    reservable_cars{
      id
      name
      licence_plate
    }
    id
    full_name
    email
    phone
    last_active
    language
    onetime
  }
}
`

// get floors of garage of specified id
export const GET_GARAGE_DETAILS = `query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $user_id: Id, $client_id: Id, $reservation_id: Id) {
  garage(id: $id) {
    id
    name
    vat
    dic
    flexiplace
    is_public
    has_payment_gate
    account {
      raiffeisenbank_is_active
      csob_is_active
      paypal_is_active
    }
    address {
      line_1
      line_2
      city
      postal_code
      state
      country
      lat
      lng
    }
    floors {
      id
      label
      scheme
      places {
        id
        label
        priority
        go_internal
        gates {
          label
          phone_number{
            number
          }
        }
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
      free_places(begins_at: $begins_at, ends_at: $ends_at, user_id: $user_id, client_id: $client_id, reservation_id: $reservation_id) {
        id
        label
      }
    }
  }
}
`

// will download free places only because garage was downloaded beforehand
export const GET_GARAGE_DETAILS_LIGHT = `query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $user_id: Id, $client_id: Id, $reservation_id: Id) {
  garage(id: $id) {
    floors {
      id
      free_places(begins_at: $begins_at, ends_at: $ends_at, user_id: $user_id, client_id: $client_id, reservation_id: $reservation_id) {
        id
        label
      }
    }
  }
}
`

export const GET_GARAGE_FREE_INTERVAL = `query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $user_id: Id, $client_id: Id, $reservation_id: Id) {
  garage(id: $id) {
    greates_free_interval(begins_at: $begins_at, ends_at: $ends_at, user_id: $user_id, client_id: $client_id, reservation_id: $reservation_id)
  }
} 
`

// create reservation mutation
export const CREATE_RESERVATION = `mutation createReservation($reservation: ReservationInput!) {
  create_reservation(reservation: $reservation) {
    id
    payment_url
  }
}
`

// update reservation mutation
export const UPDATE_RESERVATION = `mutation updateReservation($reservation: ReservationInput!, $id:Id!) {
  update_reservation(reservation: $reservation, id: $id) {
    id
  }
}
`

// export const PAY_RESREVATION = `mutation PaypalPayReservation ($token:String, $id:Id) {
// 	paypal_pay_reservation(token: $token, id: $id) {
// 		id
//     approved
// 	}
// }`


// get reservation details
export const GET_RESERVATION = `query getReservation($id: Id!) {
  reservation(id: $id) {
    id
    note
    user_id
    onetime
    car {
      id
      licence_plate
      temporary
    }
    client_id
    client {
      is_secretary
    }
    place{
      id
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

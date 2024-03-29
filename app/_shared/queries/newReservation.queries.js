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
export const GET_AVAILABLE_GARAGES = `query Query($user_id: Id, $reservation_id: Id) {
  reservable_garages(user_id: $user_id, reservation_id: $reservation_id) {
    id
    name
  }
}
`

// get available garages for this reservation form
export const GET_AVAILABLE_CLIENTS = `query Query($user_id: Id, $garage_id: Id, $reservation_id: Id) {
  reservable_clients(user_id: $user_id, garage_id: $garage_id, reservation_id: $reservation_id) {
    id
    name
    has_sms_api_token
    is_sms_api_token_active
    client_user{
      secretary
    }
    is_time_credit_active
    current_users_current_time_credit: current_time_credit
    current_time_credit(user_id: $user_id)
    time_credit_price
    time_credit_currency
    min_reservation_duration
    max_reservation_duration
    is_time_credit_active
    time_credit_price
    time_credit_currency
    sms_templates {
      id
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
    min_reservation_duration_go_public
    max_reservation_duration_go_public
    min_reservation_duration_go_internal
    max_reservation_duration_go_internal
    name
    vat
    dic
    flexiplace
    is_public
    has_payment_gate
    longterm_generating
    shortterm_generating
    account {
      raiffeisenbank_is_active
      csob_is_active
      paypal_is_active
      csob_merchant_id
    }
    gates {
      label
      phone_number {
        number
      }
      place_gates {
        place_id
      }
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
    greatest_free_interval(begins_at: $begins_at, ends_at: $ends_at, user_id: $user_id, client_id: $client_id, reservation_id: $reservation_id)
  }
} 
`

// create reservation mutation
export const CREATE_RESERVATION = `mutation createReservation($reservation: ReservationInput!) {
  create_reservation(reservation: $reservation) {
    reservation {
      id
      payment_url
      recurring_reservation_id
    }
    errors {
      message
    }
  }
}
`

// create reservation mutation
export const CREATE_RESERVATION_NEW = `mutation createReservation($reservation: ReservationInput!) {
  create_reservation_new(reservation: $reservation) {
    reservation {
      id
      payment_url
      recurring_reservation_id
    }
    errors {
      message
    }
  }
}
`

// update reservation mutation
export const UPDATE_RESERVATION = `mutation updateReservation($reservation: ReservationInput!, $id:Id!) {
  update_reservation(reservation: $reservation, id: $id) {
    reservation {
      id
    }
    errors {
      message
    }
  }
}
`

// update reservation mutation
export const UPDATE_RESERVATION_NEW = `mutation updateReservation($reservation: ReservationInput!, $id:Id!) {
  update_reservation_new(reservation: $reservation, id: $id) {
    reservation {
      id
      recurring_reservation_id
    }
    errors {
      message
    }
  }
}
`

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
      client_user{
        secretary
        internal
      }
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
    recurring_reservation_id
  }
}
`

export const GET_RECURRING_RESERVATION = `query getRecurringReservation($id: Id!) {
  recurring_reservation(id: $id) {
    id
    state
  }
}`

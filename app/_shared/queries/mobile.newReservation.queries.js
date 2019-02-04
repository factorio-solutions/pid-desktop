// get available floors, mobile purposes
export const GET_GARAGE = `query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $client_id: Id, $reservation_id: Id, $user_id: Id) {
  garage(id: $id) {
    id
    min_reservation_duration_go_public
    max_reservation_duration_go_public
    min_reservation_duration_go_internal
    max_reservation_duration_go_internal
    flexiplace
    has_payment_gate
    floors {
      label
      free_places(begins_at: $begins_at, ends_at: $ends_at, client_id: $client_id, reservation_id: $reservation_id, user_id: $user_id) {
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
          currency{
            symbol
          }
        }
      }
    }
  }
}
`

// will donwload user available for reservation with their clients
export const GET_AVAILABLE_USERS = `query ($garage_id: Id) {
  reservable_users(garage_id: $garage_id) {
    id
    full_name
    clients{
      id
    }
  }
}
`

// get available floors, mobile purposes
export const GET_AVAILABLE_FLOORS = `query ($id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $client_id: Id, $reservation_id: Id) {
  garage(id: $id) {
    flexiplace
    floors {
      label
      free_places(begins_at: $begins_at, ends_at: $ends_at, client_id: $client_id, reservation_id: $reservation_id) {
        id
        label
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
export const GET_AVAILABLE_USERS = `{
  reservable_users {
    id
    full_name
    clients{
      id
    }
  }
}
`

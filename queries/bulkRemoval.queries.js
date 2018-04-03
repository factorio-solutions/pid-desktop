
export const RESERVATIONS_QUERY = `query reservationsInDates($user_id: Id!, $secretary: Boolean!, $from: Datetime!, $to: Datetime!) {
  reservations_in_dates(user_id: $user_id, secretary: $secretary, from: $from, to: $to) {
    id
    begins_at
    ends_at
    client {
      id
      name
    }
    garage {
      id
      name
    }
  }
}
`

// download all garages
export const GET_PID_ADMIN_GARAGES = `query PidAdminGarages {
  garages {
    id
    name
  }
}
`

export const GET_PID_ADMIN_GARAGE_CLIENTS = `query PidAdminGaragesClients($ids: [Id]!) {
  garages_clients(ids: $ids) {
    name
    id
  }
}
`

export const GET_PID_ADMIN_GARAGE_CLIENTS_USERS = `query PidAdminGaragesClients($ids: [Id]!, $internal: Boolean!) {
  garages_clients_users(ids: $ids, internal: $internal) {
    full_name
    id
    clients {
      name
      id
    }
  }
}
`

export const PID_ADMIN_GENERATE_RESERVATION = `mutation GenerateReservations($garage_ids: [Id]!, $count: Int!, $date_from: Datetime!, $date_to: Datetime!, $days: [Int]!, $day_from: Int!, $day_to: Int!, $duration_from: Int!, $duration_to: Int!, $client_users: [ClientUserInput], $client_ids: [Id], $internal: Boolean, $user_count: Int) {
  generate_reservations(garage_ids: $garage_ids, count: $count, date_from: $date_from, date_to: $date_to, days: $days, day_from: $day_from, day_to: $day_to, duration_from: $duration_from, duration_to: $duration_to, client_users: $client_users, client_ids: $client_ids, internal: $internal, user_count: $user_count) {
    id
    begins_at
    ends_at
    client{
      name
    }
    user{
      full_name
    }
    recurring_reservation{
      id
    }
  }
}
`

export const PID_ADMIN_REMOVE_RESERVATION = `mutation RemoveGeneratedReservations($recurring_reservations_id: Id!, $remove_users: Boolean!) {
  remove_generated_reservations(recurring_reservations_id: $recurring_reservations_id, remove_users: $remove_users) {
    id
  }
}
`

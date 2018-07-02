export const UPDATE_CLIENT_DURATIONS = `mutation UpdateClient($client: ClientInput!, $id: Id!) {
  update_client(client: $client, id: $id) {
    id
  }
}
`

// fetches a name of client to rename
export const CLIENT_MIN_MAX_DURATIONS = `query ($id: Id!) {
  client(id: $id) {
    id
    min_reservation_duration
    max_reservation_duration
  }
}
`

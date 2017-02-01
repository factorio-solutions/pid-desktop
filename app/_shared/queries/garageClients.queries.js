// get clients and current garage layout
export const GET_GARAGE_CLIENT = `query ($id: Id!, $valid_from: Datetime!, $invalid_from: Datetime!) {
  garage(id: $id) {
    id
    name
    floors {
      label
      scheme
      places {
        label
        id
        client_places_interval(valid_from: $valid_from, invalid_from: $invalid_from) {
          client_id
        }
      }
    }
  }
  manageble_clients {
    name
    id
    created_at
  }
}
`

// update garage afther update
export const GET_GARAGE_CLIENT_UPDATE = `query ($id: Id!) {
  garage(id: $id) {
    id
    name
    floors {
      label
      scheme
      places {
        label
        id
        client_places {
          client_id
        }
      }
    }
  }
}
`

// create place client connection
export const CREATE_GARAGE_CLIENT = `mutation clientPlaceMutation($place_id: Id!, $client_id: Id!, $client_place: clientPlaceInput!) {
  create_client_place(place_id: $place_id, client_id: $client_id, client_place: $client_place) {
    client_id
    place_id
  }
}
`

// destroy place client connection
export const REMOVE_GARAGE_CLIENT = `mutation UpdateclientPlace($client_place: clientPlaceInput!, $place_id: Id!, $client_id: Id!) {
  update_client_place(client_place: $client_place, place_id: $place_id, client_id: $client_id) {
    place_id
    client_id
  }
}
`

// get clients and current garage layout
export const GET_GARAGE_CLIENT = `query($id: Id!){
  garage(id: $id){
    id
    name
    floors{
      label
      scheme
      places{
        id
        label
      }
    }
    clients{
      id
      name
      groups{
        id
        place_id
      }
    }
  }
  pricings{
    id
    name
    place_count
    groups{
      id
      place_id
    }
  }
  rents{
    id
    name
    place_count
    groups{
      id
      place_id
    }
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
export const CREATE_GROUP = `mutation createGroup ($group: GroupInput!, $place_id:Id!){
  create_group(group: $group, place_id: $place_id){
    id
  }
}
`

// destroy place client connection
export const DESTROY_GROUP = `mutation destroyGroup ($id:Id!){
  destroy_group(id: $id){
    id
  }
}
`

// get client details
export const ADD_CLIENT = `query ($id:Id!){
  client(id: $id){
    id
    name
  }
}
`

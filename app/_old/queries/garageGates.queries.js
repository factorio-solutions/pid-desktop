// get clients and current garage layout
export const GET_GARAGE_GATE = `query($id: Id!){
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
    gates{
      id
      label
      groups{
        id
        place_id
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

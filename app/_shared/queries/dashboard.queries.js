// download news and garage layout and some statistics
export const INIT_DASHBOARD = `query{
  news{
    id
    label
    url
    created_at
  }
}
`

export const INIT_GARAGE = `query Garage($id: Id!) {
  garage(id: $id) {
    floors {
      id
      label
      scheme
      places {
        id
        label
      }
    }
    contracts {
      id
      from
      to
      name
      places {
        id
      }
    }
  }
  reservations(garage_id: $id, ongoing: true, count: 99999 ){
    place_id
  }
}
`

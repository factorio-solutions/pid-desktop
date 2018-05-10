// get garage scheme
export const GET_GARAGE = `query Garage($id: Id!) {
  garage(id: $id) {
    id
    floors {
      label
      scheme
      places {
        id
        label
        third_party
        mr_parkit
        pricing{
          id
          currency_id
          flat_price
          exponential_12h_price
          exponential_day_price
          exponential_week_price
          exponential_month_price
          weekend_price
        }
      }
    }
  }
}
`

export const UPDATE_ALL_PLACES = `mutation UpdatePlaces($places: [PlaceInput]!) {
  update_places(places: $places) {
    id
  }
}
`

export const GET_GARAGE_TOKEN = `query Garage($id: Id!) {
  garage(id: $id) {
    token
  }
}
`

export const REGENERATE_GARAGE_TOKEN = `query Garage($id: Id!) {
  garage(id: $id) {
    regenerate_token
  }
}
`

// get garage scheme
export const GET_GARAGE = `query Garage($id: Id!) {
  garage(id: $id) {
    id
    min_reservation_duration_go_internal
    max_reservation_duration_go_internal
    floors {
      label
      scheme
      places {
        id
        label
        go_internal
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
  currencies{
    id
    code
    symbol
  }
}
`

export const UPDATE_ALL_PLACES = `mutation UpdatePlaces($places: [PlaceInput]!) {
  update_places(places: $places) {
    id
  }
}
`

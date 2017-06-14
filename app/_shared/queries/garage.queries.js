export const GARAGE_DETAILS_QUERY = `query Garage($id: Id!) {
  garage(id: $id) {
    id
    name
    floors {
      label
      scheme
      places {
        id
        label
        reservations {
          id
          client{
            name
          }
          car{
            licence_plate
          }
          begins_at
          ends_at
          user {
            full_name
            email
            phone
          }
        }
        pricing{
          id
          exponential_12h_price
          exponential_day_price
          exponential_month_price
          exponential_week_price
          flat_price
          weekend_price
          currency{
            code
            symbol
          }
        }
        contracts{
          rent{
            id
            price
            currency{
              code
              symbol
            }
          }
        }
      }
    }
    contracts{
      id
      client{
        name
        id
      }
      places{
        id
      }
    }
  }
}
`
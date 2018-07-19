export const GARAGE_DETAILS_QUERY = `query Garage($id: Id!, $datetime: Datetime!) {
  garage(id: $id) {
    id
    name
    dic
    vat
    iban
    floors {
      id
      label
      scheme
      places {
        id
        label
        pricing {
          id
          exponential_12h_price
          exponential_day_price
          exponential_month_price
          exponential_week_price
          flat_price
          weekend_price
          currency {
            code
            symbol
          }
        }
        id
        contracts_in_time(datetime: $datetime) {
          rent {
            id
            price
            currency {
              code
              symbol
            }
          }
        }
        reservations_in_time(datetime: $datetime) {
          id
          client {
            id
            name
          }
          car {
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
      }
    }
  }
}
`

export const GARAGE_RESERVATIONS = `
query GarageReservations($id: Id!, $datetime: Datetime!) {
  garage(id: $id) {
    floors{
      places {
        id
        contracts_in_time(datetime: $datetime) {
          rent {
            id
            price
            currency {
              code
              symbol
            }
          }
        }
        reservations_in_time(datetime: $datetime) {
          id
          client {
            id
            name
          }
          car {
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
      }
    }
  }
}

`

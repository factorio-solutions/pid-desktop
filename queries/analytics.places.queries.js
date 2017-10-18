export const PLACES_TURNOVER = `query Garage($id: Id!, $from: Datetime!, $to: Datetime!) {
  garage(id: $id) {
    floors {
      label
      scheme
      places {
        id
        label
        reservations_turnover(from: $from, to: $to){
          price
          created_at
          currency{
            symbol
          }
        }
        contracts_turnover(from: $from, to: $to){
          from
          to
          rent{
            price
            currency{
              symbol
            }
          }
        }
      }
    }
  }
}
`

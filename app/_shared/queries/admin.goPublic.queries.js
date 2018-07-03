// get garage scheme
export const GET_GARAGE = `query Garage($id: Id!) {
  garage(id: $id) {
    id
    min_reservation_duration_go_public
    max_reservation_duration_go_public
    floors {
      label
      scheme
      places {
        id
        label
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

// get selected place pricing
export const CREATE_PRICING = `mutation createPricing($pricing: PricingInput!){
  create_pricing(pricing: $pricing){
    id
  }
}
`

export const UPDATE_PRICING = `mutation updatePricing($pricing:PricingInput!, $id:Id!){
  update_pricing(pricing: $pricing, id: $id){
    id
  }
}
`

export const UPDATE_GARAGE_DURATIONS = `mutation UpdateGarage($garage: GarageInput!, $id: Id!) {
  update_garage(garage: $garage, id: $id) {
    id
  }
}
`

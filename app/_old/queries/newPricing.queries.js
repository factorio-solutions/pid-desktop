export const GET_CURRENCIES=`query{
  currencies{
    id
    code
    symbol
  }
}`

export const CREATE_PRICING = `mutation createPricing($pricing: PricingInput!){
  create_pricing(pricing: $pricing){
    id
  }
}`

export const GET_DETAILS =`query($pricing_id:Id!){
	pricings(pricing_id:$pricing_id){
    currency_id
    name
    flat_price
    exponential_12h_price
    exponential_day_price
    exponential_week_price
    exponential_month_price
    weekend_price
  }
}
`

export const UPDATE_PRICING = `mutation updatePricing($pricing:PricingInput!, $id:Id!){
  update_pricing(pricing: $pricing, id: $id){
    id
  }
}
`
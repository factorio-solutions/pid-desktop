// will go and download pricings available in selected garage
export const INIT_GARAGE_PRICINGS = `query ($id: Id!) {
  garage(id: $id) {
    pricings {
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
  currencies{
    id
    code
    symbol
  }
}

`

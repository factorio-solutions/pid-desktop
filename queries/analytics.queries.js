export const GARAGE_TURNOVER = `query ($id:Id!, $from:Datetime!, $to:Datetime!){
  contract_analytics(id: $id, from: $from, to: $to){
    created_at
    places{
      id
    }
    rent{
      price
      currency{
        symbol
      }
    }
  }
  reservation_analytics(id: $id, from: $from, to: $to){
    price
    created_at
    currency{
      symbol
    }
  }
}
`

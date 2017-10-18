export const INIT_RESERVATIONS = `query ($id:Id!, $from:Datetime!, $to:Datetime!){
  reservation_analytics(id: $id, from: $from, to: $to){
    price
    created_at
    currency{
      symbol
    }
  }
}
`

export const INIT_CONTRACTS = `query ($id:Id!, $from:Datetime!, $to:Datetime!){
  contract_analytics(id: $id, from: $from, to: $to){
    from
    to
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
}
`

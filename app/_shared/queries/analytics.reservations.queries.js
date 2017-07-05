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

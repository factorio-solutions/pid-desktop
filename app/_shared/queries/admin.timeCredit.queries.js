export const CLIENT_TIME_CREDIT = `query GetCleintsTimeCredit($id: Id!) {
  client(id: $id){
    is_time_credit_active
    time_credit_price
    time_credit_currency
    time_credit_amount_per_month
  }
}
`

export const UPDATE_TIME_CREDIT = `mutation UpdateTimeCredit($id:Id!, $client:ClientInput!) {
  update_client(id: $id, client: $client){
    id
  }
}
`

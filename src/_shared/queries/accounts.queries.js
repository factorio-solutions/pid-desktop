export const GET_ACCOUNTS = `query{
  accounts{
    id
    name
    merchant_id
    address{
      line_1
      line_2
      city
      postal_code
      state
      country
    }
  }
}
`

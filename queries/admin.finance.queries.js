export const GET_RENTS = `{
  rents{
    id
    name
    currency{
      code
      symbol
    }
    price
    place_count
  }
}
`

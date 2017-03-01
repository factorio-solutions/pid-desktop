// fetch available tarifs and their prices
export const GET_TARIFS = `query { 
  tarifs{
    name
    price
    currency{
      symbol
    }
  }
}
`

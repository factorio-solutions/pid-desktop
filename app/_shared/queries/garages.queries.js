// Will fetch all garages, their name, id and datetime of creation
export const GET_GARAGES = `{
  user_garages {
    garage {
      lpg
      name
      created_at
      id
      place_count
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
  pricings{
    id
    name
    currency{
      code
      symbol
    }
    exponential_decay
    exponential_max_price
    exponential_min_price
    flat_price
    weekend_price
    place_count
  }
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


// remove Garage of id
export const DESTROY_GARAGE = `mutation reservationMuation($id: Id!) {
  destroy_garage(id: $id) {
    id
  }
}
`

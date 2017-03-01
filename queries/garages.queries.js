// Will fetch all garages, their name, id and datetime of creation
<<<<<<< HEAD
export const GET_GARAGES        = '{ user_garages { garage { name, created_at, id, place_count, address} } }'

// remove Garage of id
export const DESTROY_GARAGE      = 'mutation reservationMuation ($id: Id!){ destroy_garage (id: $id){ id } }'
=======
export const GET_GARAGES = `{
  current_user{
    id
  }
  user_garages {
    admin
    user_id
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
    exponential_12h_price
    exponential_day_price
    exponential_week_price
    exponential_month_price
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
>>>>>>> feature/new_api

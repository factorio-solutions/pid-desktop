// Create new garage
<<<<<<< HEAD
export const CREATE_NEW_GARAGE = 'mutation garageMutations($garage: GarageInput!) { create_garage (garage: $garage) { id } }'

// Fetches details of garage
export const GET_GARAGE_DETAILS = 'query ($id: Id!){ garage(id: $id) { id, name, address, GPS, floors {label, scheme } } }'

// Update existing garage
export const UPDATE_GARAGE     = 'mutation UpdateGarage($garage: GarageInput!, $id: Id!) { update_garage(garage: $garage, id: $id) { id } }'
=======
export const CREATE_NEW_GARAGE = `mutation garageMutations($garage: GarageInput!) {
  create_garage(garage: $garage) {
    id
  }
}
`

// Update existing garage
export const UPDATE_GARAGE = `mutation UpdateGarage($garage: GarageInput!, $id: Id!) {
  update_garage(garage: $garage, id: $id) {
    id
  }
}
`

// Fetches details of garage
export const GET_GARAGE_DETAILS = `query ($id: Id!) {
  garage(id: $id) {
    id
    account_id
    pid_tarif_id
    name
    lpg
    gates {
      id
      label
      phone
      address {
        line_1
        line_2
        city
        postal_code
        state
        country
        lat
        lng
      }
      places{
        label
      }
    }
    floors {
      label
      scheme
    }
  }
}
`

export const GET_ACCOUNTS_TARIFS = `query{
  tarifs{
    id
    name
    price
    currency{
      symbol
    }
  }
  accounts{
    id
    name
  }
}
`
>>>>>>> feature/new_api

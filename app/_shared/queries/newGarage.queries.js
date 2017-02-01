// Create new garage
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

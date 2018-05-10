export const PRESIGNE_GARAGE_IMAGE_QUERY = `query UploadFile{
  upload_garage_image
}
`
// Create new garage
export const CREATE_NEW_GARAGE = `mutation garageMutations($garage: GarageInput!) {
  create_garage(garage: $garage) {
    id
    payment_url
  }
}
`

// Update existing garage
export const UPDATE_GARAGE = `mutation UpdateGarage($garage: GarageInput!, $id: Id!) {
  update_garage(garage: $garage, id: $id) {
    id
    payment_url
  }
}
`

// Fetches details of garage
export const GET_GARAGE_DETAILS = `query ($id: Id!) {
  garage(id: $id) {
    id
    pid_tarif_id
    name
    company
    ic
    dic
    img
    lpg
    length
    height
    width
    weight
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
    gates {
      id
      label
      phone
      address {
        line_1
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

export const GET_GARAGE_DETAILS_GENERAL =`query ($id: Id!) {
  garage(id: $id) {
    id
    pid_tarif_id
    name
    company
    ic
    dic
    iban
    img
    lpg
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
  }
}`

export const GET_GARAGE_DETAILS_FLOORS =`query ($id: Id!) {
  garage(id: $id) {
    id
    length
    height
    width
    weight
    floors {
      label
      scheme
    }
  }
}`

export const GET_GARAGE_DETAILS_GATES = `query ($id: Id!) {
  registered_phone_numbers {
    id
    number
  }
  garage(id: $id) {
    id
    pid_tarif_id
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

    floors {
      label
      scheme
      places {
        label
      }
    }
    gates {
      id
      label
      phone
      has_password
      phone_number_id
      address {
        line_1
        lat
        lng
      }
      places {
        label
        floor {
          label
        }
      }
    }
  }
}`

export const GET_GARAGE_DETAILS_ORDER = `query ($id: Id!) {
  garage(id: $id) {
    id
    floors {
      label
      scheme
      places {
        id
        label
        priority
      }
    }
  }
}`


export const GET_ACCOUNTS_TARIFS = `query{
  tarifs{
    id
    name
    price
    currency{
      symbol
    }
  }
}
`
// accounts{
//   id
//   name
// }

export const CREATE_RENT = `
mutation createRent($rent: RentInput!){
  create_rent(rent: $rent){
    id
  }
}
`

export const UPDATE_RENT = `mutation updateRent($rent:RentInput!, $id:Id!){
  update_rent(rent: $rent, id: $id){
    id
  }
}
`

export const GET_RENT_DETAILS = `query($rent_id:Id!){
	rents(rent_id:$rent_id){
    currency_id
    name
    price
  }
}
`

export const GET_GARAGE_MODULES = `query GetGarage($id: Id!){
  garage(id: $id){
  	id
    is_public
    marketing{
      id
      short_name
      active_marketing_launched
    }
  }
}
`

// edit marketing - returns garageType
export const UPDATE_MARKETING = `mutation UpdateMarketing($id: Id!, $marketing: MarketingInput!) {
  update_marketing(id: $id, marketing: $marketing) {
    payment_url
  }
}
`

// edit garge
export const UPDATE_GARAGE = `mutation UpdateGarage($id: Id!, $garage: GarageInput!) {
  update_garage(id: $id, garage: $garage) {
    id
    is_public
  }
}
`

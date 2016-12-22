// Create new garage
export const CREATE_NEW_GARAGE = 'mutation garageMutations($garage: GarageInput!) { create_garage (garage: $garage) { id } }'

// Fetches details of garage
export const GET_GARAGE_DETAILS = 'query ($id: Id!){ garage(id: $id) { id, name, address, GPS, floors {label, scheme } } }'

// Update existing garage
export const UPDATE_GARAGE     = 'mutation UpdateGarage($garage: GarageInput!, $id: Id!) { update_garage(garage: $garage, id: $id) { id } }'

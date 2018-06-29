export const PRESIGNE_GARAGE_DOCUMENT_QUERY = `query UploadFile{
  upload_document
}
`

export const UPDATE_GARAGE = `mutation UpdateGarage($garage: GarageInput!, $id: Id!) {
  update_garage(garage: $garage, id: $id) {
    id
  }
}
`

const documentParameters = `{
  id
  document
  document_type
  document_name
  updated_at
}
`

export const GET_GARAGE_DOCUMENTS = types => `query ($id: Id!) {
  garage(id: $id) {
    id
    ${types.reduce((acc, type) => {
      return acc + `${type}_documents${documentParameters}`
    }, '')}
  }
}
`

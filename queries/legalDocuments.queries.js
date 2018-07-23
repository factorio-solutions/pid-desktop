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

export const GET_GARAGE_DOCUMENTS = `query ($id: Id!) {
  garage(id: $id) {
    id
    documents{
      id
      url
      doc_type
      name
      lang
      updated_at
    }
  }
}
`

export const DESTROY_DOCUMENTS = `mutation destroyDocuments($ids: [Id!])
  destroy_documents(ids: $ids){
    id
  }
`

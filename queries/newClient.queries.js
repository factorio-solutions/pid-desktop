// will create new client
export const CREATE_NEW_CLIENT = `mutation clientMutations($client: ClientInput!) {
  create_client(client: $client) {
    id
  }
}
`

//fetches a name of client to rename
export const EDIT_CLIENT_INIT = `query ($id: Id!) {
  client_users(client_id: $id) {
    client {
      id
      name
      ic
      dic
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
}
`

// edit client name
export const EDIT_CLIENT_MUTATION = `mutation RenameClient($client: ClientInput!, $id: Id!) {
  update_client(client: $client, id: $id) {
    id
  }
}
`

export const LOAD_INFO_FROM_IC = `query IcToInfo($ic:String){
  ares(ic:$ic)
}
`

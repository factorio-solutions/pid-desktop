// will create new client
export const CREATE_NEW_CLIENT = `mutation clientMutations($client: ClientInput!) {
  create_client(client: $client) {
    id
    name
  }
}
`

//fetches a name of client to rename
export const EDIT_CLIENT_INIT = `query ($id: Id!) {
  client_users(client_id: $id) {
    client {
      id
      name
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

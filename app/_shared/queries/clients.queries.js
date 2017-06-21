// fetch all clients
export const GET_CLIENTS = `{
  current_user {
    id
  }
  client_users {
    client_id
    user_id
    admin
    client {
      name
      token
      id
      user_count
      contracts{
        name
        id
      }
    }
  }
}
`

export const GARAGE_CONTRACTS = `query GargeContracts($id: Id!){
  garage(id: $id){
    contracts{
      name
      id
      client{
        name
        token
        id
        user_count
      }
    }
  }
}`

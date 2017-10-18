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
      place_count
      all_invoices_paid
      created_at
      contracts{
        from
        to
        place_count
        name
        id
        rent{
          price
          currency{
            symbol
          }
        }
      }
      contact_persons{
        full_name
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
      from
      to
      place_count
      rent{
        price
        currency{
          symbol
        }
      }
      client{
        name
        token
        id
        user_count
        place_count
        all_invoices_paid
        contact_persons{
          full_name
        }
      }
    }
  }
}`

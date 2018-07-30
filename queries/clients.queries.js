// fetch all clients of current user
export const GET_CLIENTS = `{
  clients{
    name
    token
    id
    user_count
    all_invoices_paid
    created_at
    client_user{
      admin
      pending
    }
    contracts{
      contract_places{
        id
      }
      from
      to
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
      email
      phone
    }
  }
}
`

// fetch client of garage
export const GARAGE_CONTRACTS = `query GargeContracts($id: Id!){
  garage(id: $id){
    contracts{
      name
      id
      from
      to
      contract_places{
        id
      }
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

        all_invoices_paid
        created_at
        is_admin
        is_pending
        contact_persons{
          full_name
          email
          phone
        }
      }
    }
  }
}`

export const GET_GARAGE_CLIENT = `query GetGarage($garage_id: Id!, $begins_at: Datetime!, $ends_at: Datetime!, $client_id: Id, $contract_id: Id) {
  garage(id: $garage_id) {
    id
    is_admin
    is_public
    name
    vat
    dic
    floors{
      id
      label
      scheme
      places{
        id
        label
        pricing{
          currency{
            symbol
          }
          exponential_12h_price
          exponential_day_price
          exponential_month_price
          exponential_week_price
          flat_price
          weekend_price
        }
      }
      contractable_places(begins_at: $begins_at, ends_at: $ends_at, client_id: $client_id, contract_id: $contract_id) {
        id
        label
      }
    }
    clients{
      name
      contracts{
        id
        from 
        to
        rent{
          currency{
            symbol
          }
          price
        }
        places{
          id
        }
        generate_invoice
      }
    }
  }
}
`

export const ADD_CLIENT = `query ($token: String!){
  client_by_token(token:$token){
    id
    name
  }
}
`

export const GET_CURRENCIES = `{currencies{
    id
    code
    symbol
  }
}
`

export const CREATE_CONTRACT = `mutation CreateContract($contract: ContractInput!){
  create_contract(contract: $contract){
    id
  }
}
`

export const UPDATE_CONTRACT = `mutation UpdateConctact($id:Id!, $contract:ContractInput!){
  update_contract(contract: $contract, id: $id){
    id
  }
}
`

export const GET_CONTRACT_DETAILS = `query ($id:Id!) {
  contract(id:$id){
    id
    from
    to
    security_interval
    garage{
      id
      name
    }
    client{
      id
    }
    places{
      id
      label
    }
    rent{
      id
      price
      currency{
        symbol
      }
    }
    generate_invoice
  }
}
`

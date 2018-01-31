export const GET_GARAGE_CLIENT = `query GetGarage($garage_id: Id!, $from: Datetime!, $to: Datetime!, $contract_id: Id) {
  garage(id: $garage_id) {
    id
    is_admin
    name
    floors {
      label
      scheme
      contractable_places(from: $from, to: $to, contract_id: $contract_id) {
        id
      }
      places{
        id
        label
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
  }
}
`

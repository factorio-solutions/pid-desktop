export const GET_GARAGE_CLIENT = `query($id: Id!){
  garage(id: $id){
    id
    name
    floors{
      label
      scheme
      places{
        id
        label
      }
    }
    contracts{
      id
      from
      to
      name
      client{
        id
      }
      places{
        id
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
    }
  }
}
`

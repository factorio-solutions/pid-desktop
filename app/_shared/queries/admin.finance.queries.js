export const GET_RENTS = `{
  rents{
    id
    name
    currency{
      code
      symbol
    }
    price
    place_count
  }
}
`

export const GET_GARAGE_PAYMENT_METHOD = `query ($id:Id!){
  garage(id:$id){
    account{
      id
      paypal_email
      csob_merchant_id
    }
  }
}
`
export const GET_PERMISSION = `mutation PaypalGetPermission ($url:String!) { paypal_get_permissions(url: $url) }`

// updates existing account
export const UPDATE_ACCOUNT = `mutation updateAccount ($id:Id!, $account:AccountInput!){
  update_account(id:$id, account: $account){
    id
  }
}`

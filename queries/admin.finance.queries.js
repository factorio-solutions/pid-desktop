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
    vat
    invoice_row
    simplyfied_invoice_row
    account_number
    account{
      id
      paypal_email
      csob_merchant_id
      csob_private_key
      gp_webpay_merchant_id
      gp_webpay_private_key
      iban
    }
  }
}
`

export const GET_PERMISSION = `mutation PaypalGetPermission ($url:String!, $account_id:Id!) {
  paypal_get_permissions(url: $url, account_id: $account_id)
}
`

// updates existing account
export const UPDATE_ACCOUNT = `mutation updateAccount ($id:Id!, $account:AccountInput!){
  update_account(id:$id, account: $account){
    id
    paypal_email
    csob_merchant_id
    csob_private_key
    gp_webpay_merchant_id
    gp_webpay_private_key
    gp_webpay_password
    return_url
  }
}
`

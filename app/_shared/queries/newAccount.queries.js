// creates new account
export const CREATE_ACCOUNT = `mutation createAccount ($account:AccountInput!){
  create_account(account: $account){
    id
  }
}`

// updates existing account
export const UPDATE_ACCOUNT = `mutation updateAccount ($id:Id!, $account:AccountInput!){
  update_account(id:$id, account: $account){
    id
  }
}`

export const INIT_ACCOUNT = `query ($id:Id){
  accounts(id: $id){
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
}`

// Will retrieve permissions url
export const GET_PERMISSION = `mutation PaypalGetPermission ($url:String!) { paypal_get_permissions(url: $url) }`

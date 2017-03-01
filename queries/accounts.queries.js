<<<<<<< HEAD
// fetch all accounts
export const GET_ACCOUNTS = '{current_user { id }, account_users { account_id, user_id, can_manage, account { name, id, created_at, user_count } }}'
=======
export const GET_ACCOUNTS = `query{
  accounts{
    id
    name
    merchant_id
    address{
      line_1
      line_2
      city
      postal_code
      state
      country
    }
  }
}
`
>>>>>>> feature/new_api

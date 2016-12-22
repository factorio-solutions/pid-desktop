// will create new account
export const CREATE_NEW_ACCOUNT = 'mutation accountMutations($account: AccountInput!) { create_account(account: $account) { id, name } }'

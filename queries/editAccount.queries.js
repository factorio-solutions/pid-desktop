//fetches a name of account to rename
export const EDIT_ACCOUNT_INIT = "query ($id: Id!) { account_users(account_id: $id) { account { id, name} } }"

// edit account name
export const EDIT_ACCOUNT_MUTATION = "mutation RenameAccount($account: AccountInput!, $id: Id!) { update_account(account: $account, id: $id) { id } }"

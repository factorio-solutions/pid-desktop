// fetch all accounts
export const GET_ACCOUNTS = '{current_user { id }, account_users { account_id, user_id, can_manage, account { name, id, created_at, user_count } }}'

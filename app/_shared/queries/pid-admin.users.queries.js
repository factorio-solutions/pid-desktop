// Will return impersonation link
export const IMPERSONATE_USER = `query ImpersonateUser ($id: Id!){
  impersonate_user(id: $id)
}
`

// Users paginated table query
export const USERS_PAGINATED_TABLE = `query Users($count: Int, $page: Int, $order_by: String, $includes: String, $search: Hash) {
  users(count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search) {
    id
    full_name
  }
}
`

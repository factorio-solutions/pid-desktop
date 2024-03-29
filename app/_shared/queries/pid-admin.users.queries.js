// Will return impersonation link
export const IMPERSONATE_USER = `query ImpersonateUser ($id: Id!, $return_domain: String){
  impersonate_user(id: $id, return_domain: $return_domain)
}
`

// Users paginated table query
export const USERS_PAGINATED_TABLE = `query Users($count: Int, $page: Int, $order_by: String, $includes: String, $search: Hash) {
  users_metadata(count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search) {
    count
    page
  }
  users(count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search) {
    id
    full_name
    last_active
    email
    mobile_app_version
  }
}
`

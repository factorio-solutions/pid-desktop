export const GET_LOGS_PAGINATION_QUERY = `query ($garage_id:Id!, $count: Int, $page: Int, $order_by: String, $includes: String, $search: Hash) {
  logs_metadata(garage_id:$garage_id, count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search) {
    count
    page
  }

  logs(garage_id:$garage_id, count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search){
    action
    model
    created_at
    user{
      full_name
      email
    }
  }
}
`

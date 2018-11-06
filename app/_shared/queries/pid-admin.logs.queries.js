// Gel invoices
export const GET_ADMIN_LOGS = `query ($count: Int, $page: Int, $order_by: String, $includes: String, $search: Hash){
  logs_metadata(count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search) {
    count
    page
  }

  logs(count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search){
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

export const GET_ADMIN_ACCESS_LOGS = `query ($count: Int, $page: Int, $order_by: String, $includes: String, $search: Hash){
  gate_access_logs_metadata(count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search){
    count
    page
  }

  gate_access_logs(count: $count, page: $page, order_by: $order_by, includes: $includes, search: $search){
    user_phone
    access_type
    created_at
    user {
      full_name
      email
      phone
    }
    gate {
      label
      phone
    }
    reservation {
      id
      place {
        label
        floor {
          label
          garage {
            name
          }
        }
      }
      begins_at
      ends_at
    }
  }
}

`

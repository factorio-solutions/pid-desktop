// Gel invoices
export const GET_ADMIN_LOGS = `query{
  logs{
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

export const GET_ADMIN_ACCESS_LOGS = `{
  gate_access_logs {
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

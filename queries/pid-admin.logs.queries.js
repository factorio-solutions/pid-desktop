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

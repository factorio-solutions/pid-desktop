export const GET_LOGS = `query ($garage_id: Id!) {
  logs(garage_id:$garage_id){
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

// Will return impersonation link
export const IMPERSONATE_USER = `query ImpersonateUser ($id: Id!){
  impersonate_user(id: $id)
}
`

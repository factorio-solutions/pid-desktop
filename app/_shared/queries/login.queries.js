// login user - has to be inline
export const LOGIN_USER = `query LoginUser($email: String, $password: String, $refresh_token: String) { login(email: $email, password: $password, refresh_token: $refresh_token) }`

// will revoke refresh token passed to it
export const REVOKE_TOKEN = `query RevokeToken($refresh_token: String) {
  revoke_token(refresh_token:$refresh_token)
}
`

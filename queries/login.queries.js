// login user - has to be inline
export const LOGIN_USER = `query LoginUser($email: String!, $password: String!, $refresh_token: String, $device_fingerprint: String) { login(email: $email, password: $password, refresh_token: $refresh_token, device_fingerprint: $device_fingerprint) }`

// will revoke refresh token passed to it
export const REVOKE_TOKEN = `query RevokeToken($refresh_token: String) {
  revoke_token(refresh_token:$refresh_token)
}
`

// will verify email sent code against Auth0
export const LOGIN_VERIFICATION = `query	LoginVerifyQuery($email:String, $code:String, $device_fingerprint: String){ login_verification(email: $email, code: $code, device_fingerprint: $device_fingerprint) }`

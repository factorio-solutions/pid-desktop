// login user - has to be inline
export const LOGIN_USER = `query LoginUser($email: String!, $password: String!) { login(email: $email, password: $password) }`

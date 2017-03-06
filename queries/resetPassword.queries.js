// will send password reseting email to user
export const RESET_PASSWORD = `query ($email:String!) { reset_password(email:$email) }`

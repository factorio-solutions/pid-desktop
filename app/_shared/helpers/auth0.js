import Auth0 from 'auth0-js'

// pid - api
const CLIENT_ID = 'wREK8Tk0OXH1DKiFPWIPYfrq9TKX84iQ'
export const DOMAIN = 'pid.eu.auth0.com'
export const CONNECTION = 'Username-Password-Authentication'
export const _auth0 = new Auth0({ domain: DOMAIN, clientID: CLIENT_ID})

// pid - alpha - api
// const CLIENT_ID = 'upis38OtnHvxs676JLrwIRSfNMEsvABY'
// export const DOMAIN = 'hrstktom.eu.auth0.com'
// export const CONNECTION = 'Username-Password-Authentication'
// export const _auth0 = new Auth0({ domain: DOMAIN, clientID: CLIENT_ID})

// get current user
export const GET_CURRENT_USER = `{
  current_user {
    full_name
    id
    email
    phone
    language
    secretary
  }
}
`

// Get available garages
export const GET_RESERVABLE_GARAGES = `query Query($user_id: Id!) {
  reservable_garages(user_id: $user_id) {
    id
    name
  }
}
`

export const GET_CURRENT_MOBILE_VERSION = `query MobileAppVersion($platform:String) {
  mobile_app_version(platform: $platform)
} `

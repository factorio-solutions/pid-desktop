export const GET_ALL_MOBILE_APP_VERSIONS = `query {
  mobile_app_all_versions {
    id
    platform
    version
  }
}`

export const UPDATE_ALL_MOBILE_APP_VERSIONS = (
  `mutation ($mobile_app_versions: [MobileAppVersionInput]!) {
    update_mobile_app_versions(mobile_app_versions: $mobile_app_versions) {
      id
      platform
      version
    }
  }`
)

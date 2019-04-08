import request from '../helpers/requestAdmin'
import { IMPERSONATE_USER } from '../queries/pid-admin.users.queries'


export function impersonate(id) {
  return () => {
    request(IMPERSONATE_USER, { id, return_domain: window.location.origin })
      .then(res => res.impersonate_user && location.replace(res.impersonate_user))
  }
}

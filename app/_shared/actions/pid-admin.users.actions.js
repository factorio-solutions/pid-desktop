import request from '../helpers/requestAdmin'
import { IMPERSONATE_USER } from '../queries/pid-admin.users.queries'


export function impersonate(id) {
  return () => {
    request(IMPERSONATE_USER, { id })
      .then(res => res.impersonate_user && location.replace(res.impersonate_user))
  }
}

import * as nav from './navigation'
import { adminEntryPoint } from '../../index'

export default function requestAdmin(query, variables = null) {
  return fetch(adminEntryPoint, {
    method:  'POST',
    headers: {
      'content-type': 'application/json',
      Authorization:  'Bearer ' + localStorage.jwt
    },
    body: JSON.stringify({ query, variables })
  }).then(response => {
    if (response.ok) {
      return response
      .json()
      .then(resp => resp.data)
    } else {
      switch (response.status) {
        case 401:
          delete localStorage.jwt
          nav.to('/')
          break
        default:
          nav.to('/occupancy')
      }
    }
  }).catch(error => {
    console.error(error, error.status)
    nav.to('/')
  })
}

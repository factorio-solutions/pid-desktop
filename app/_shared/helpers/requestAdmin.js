import localforage from 'localforage'

import * as nav from './navigation'
import { adminEntryPoint } from '../../index'

export default async function requestAdmin(query, variables = null) {
  return fetch(adminEntryPoint, {
    method:  'POST',
    headers: {
      'content-type': 'application/json',
      Authorization:  'Bearer ' + await localforage.getItem('jwt')
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
          localforage.removeItem('jwt')
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

import localforage from 'localforage'

import * as nav from './navigation'
import { store, mobile, entryPoint } from '../../index'
import { setNotificationCount } from '../actions/notifications.actions'


// helper request sender queries to the GraphQL API

// import { request }  from '../_shared/helpers/request'
//
// request ((response) => { console.log(response) }, "{garages{name}}")
export async function request(onSuccess, query, variables = null, operationName = null, onError) {
  const data = { query,
    operationName,
    variables
  }

  const xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = async () => {
    if (xmlHttp.status === 401) { // unauthorized
      if (mobile) { // mobile handle 401 error
        window.dispatchEvent(new Event('unauthorizedAccess'))
      } else { // desktop handle
        localforage.removeIterm('jwt')
        const redirect = await localforage.getItem('redirect')
        if (!redirect) {
          await localforage.setItem('redirect', window.location.hash.substring(4, window.location.hash.indexOf('?')))
        }
        nav.to('/')
      }
    } else if (xmlHttp.readyState === 4) { // not 401 status
      try {
        const response = JSON.parse(xmlHttp.responseText)
        store.dispatch(setNotificationCount(response.notifications.data.notifications.length))
        onSuccess({ data: response.data })
      } catch (e) {
        if (onError === undefined) {
          throw (e)
        } else {
          onError(e)
        }
      }
    }
  }

  xmlHttp.open('POST', entryPoint, true)
  xmlHttp.setRequestHeader('Content-type', 'application/json')
  xmlHttp.setRequestHeader('Authorization', 'Bearer ' + await localforage.getItem('jwt'))
  xmlHttp.send(JSON.stringify(data))
}

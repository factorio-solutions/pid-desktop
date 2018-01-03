import * as nav from './navigation'
import { store, mobile, entryPoint } from '../../index'
import { setNotificationCount } from '../actions/notifications.actions'


// helper request sender queries to the GraphQL API

// import { request }  from '../_shared/helpers/request'
//
// request ((response) => { console.log(response) }, "{garages{name}}")
export function request(onSuccess, query, variables = null, operationName = null, onError) {
  const data = { query
               , operationName
               , variables
               }

  const xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.status === 401) { // unauthorized
      if (mobile) { // mobile handle 401 error
        window.dispatchEvent(new Event('unauthorizedAccess'))
      } else { // desktop handle
        delete localStorage.jwt
        if (localStorage.redirect === undefined) {
          localStorage.redirect = window.location.hash.substring(4, window.location.hash.indexOf('?'))
        }
        nav.to('/')
      }
    } else { // not 401 status
      if (xmlHttp.readyState === 4) {
        try {
          const response = JSON.parse(xmlHttp.responseText)
          store.dispatch(setNotificationCount(response.notifications.data.notifications.length))
          onSuccess({ data: response.data })
        } catch (e) {
          if (onError === undefined) {
            throw (e)
          } else {
            onError()
          }
        }
      }
    }
  }

  xmlHttp.open('POST', entryPoint, true)
  xmlHttp.setRequestHeader('Content-type', 'application/json')
  xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.jwt)
  xmlHttp.send(JSON.stringify(data))
}

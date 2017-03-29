import * as nav                 from './navigation'
import { store, mobile }        from '../../index'
import { setNotificationCount } from '../actions/notifications.actions'


// helper request sender queries to the GraphQL API

// import { request }  from '../_shared/helpers/request'
//
// request ((response) => { console.log(response) }, "{garages{name}}")
export function request (onSuccess, query, variables = null, operationName = null, onError ){
  const entryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000')+'/queries'
  // const entryPoint = 'https://park-it-direct.herokuapp.com/queries'
  // const entryPoint = 'https://park-it-direct-alpha.herokuapp.com/queries'
  // const entryPoint = 'http://localhost:3000/queries'

  const data = { query
               , operationName
               , variables
               }

  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.status == 401) { // unauthorized
      if (mobile){ // mobile handle 401 error
        window.dispatchEvent( new Event('unauthorizedAccess') )
      } else { // desktop handle
        delete localStorage['jwt']
        if (localStorage['redirect'] == undefined)  {
          localStorage['redirect'] = window.location.hash.substring(4, window.location.hash.indexOf('?'))
        }
        nav.to('/')
      }
    } else { // not 401 status
      if (xmlHttp.readyState == 4){
        try {
          const response = JSON.parse(xmlHttp.responseText)
          store.dispatch(setNotificationCount(response.notifications.data.notifications.length))
          onSuccess({data: response.data})
        } catch (e) {
          if (onError === undefined) {
            throw(e)
          } else {
            onError()
          }
        }
      }
    }
  }

  xmlHttp.open('POST', entryPoint, true)
  xmlHttp.setRequestHeader('Content-type', 'application/json')
  xmlHttp.setRequestHeader('Authorization', 'Bearer '+ localStorage['jwt'])
  xmlHttp.send(JSON.stringify(data))
}

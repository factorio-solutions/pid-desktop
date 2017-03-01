import * as nav                 from './navigation'
import { store, mobile }        from '../../index'
import { setNotificationCount } from '../actions/notifications.actions'


// helper request sender queries to the GraphQL API

// import { request }  from '../_shared/helpers/request'
//
// request ((response) => { console.log(response) }, "{garages{name}}")
export function request (onSuccess, query, variables = null, operationName = null ){
  var entryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000')+'/queries'
<<<<<<< HEAD
  
=======

>>>>>>> feature/new_api
  var data = { query
             , operationName
             , variables
             }

  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.status == 401) { // unauthorized
      delete localStorage['jwt']

      if (mobile){
        // mobile handle 401 error

      } else {
        if (localStorage['redirect'] == undefined)  {
          localStorage['redirect'] = window.location.hash.substring(4, window.location.hash.indexOf('?'))
        }
        nav.to('/')
      }
    }
    if (xmlHttp.readyState == 4){
<<<<<<< HEAD
      var response = JSON.parse(xmlHttp.responseText)
=======
      const response = JSON.parse(xmlHttp.responseText)
>>>>>>> feature/new_api
      store.dispatch(setNotificationCount(response.notifications.data.notifications.length))
      onSuccess({data: response.data})
    }
  }

  xmlHttp.open('POST', entryPoint, true)
  xmlHttp.setRequestHeader('Content-type', 'application/json')
  xmlHttp.setRequestHeader('Authorization', 'Bearer '+ localStorage['jwt'])
  xmlHttp.send(JSON.stringify(data))
}

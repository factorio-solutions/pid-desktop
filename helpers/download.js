import * as nav                 from './navigation'

// helper download file from API

// import { download }  from '../_shared/helpers/download'
// download ('HelloKity.pdf', "query { download_invoice }")

export function download (filename, query, variables = undefined){
  const entryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000')+'/queries'

  let xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.status == 401) { // unauthorized, navivate home
      delete localStorage['jwt']
      if (localStorage['redirect'] == undefined)  {
        localStorage['redirect'] = window.location.hash.substring(4, window.location.hash.indexOf('?'))
      }
      nav.to('/')
    }
    if (xmlHttp.readyState == 4){
      // const blob = new Blob([xmlHttp.responseText], {type : 'application/pdf'})
      // a.href     = window.URL.createObjectURL(blob)

      const data = JSON.parse(xmlHttp.responseText)
      let a      = document.createElement('a')
      a.download = filename
      a.href     = data.data
      a.target   = '_blank'
      a.click()
    }
  }

  xmlHttp.open('POST', entryPoint, true)
  xmlHttp.setRequestHeader('Content-type', 'application/json')
  xmlHttp.setRequestHeader('Authorization', 'Bearer '+ localStorage['jwt'])
  xmlHttp.send(JSON.stringify({ query, variables }))
}

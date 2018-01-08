import JSZip    from 'jszip'
import * as nav from './navigation'

// helper download file from API

// import { download }  from '../_shared/helpers/download'
// download ('HelloKity.pdf', "query { download_invoice }")

export function createDownloadLink(data, filename) {
  const a = document.createElement('a')
  a.download = filename
  a.href = data
  a.target = '_blank'
  return a
}

export function downloadData(onSuccess, query, variables = undefined) {
  const entryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000') + '/queries'

  const xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.status === 401) { // unauthorized, navivate home
      delete localStorage.jwt
      if (localStorage.redirect === undefined) {
        localStorage.redirect = window.location.hash.substring(4, window.location.hash.indexOf('?'))
      }
      nav.to('/')
    }
    if (xmlHttp.readyState === 4) {
      const data = JSON.parse(xmlHttp.responseText)
      onSuccess(data.data)
    }
  }

  xmlHttp.open('POST', entryPoint, true)
  xmlHttp.setRequestHeader('Content-type', 'application/json')
  xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.jwt)
  xmlHttp.send(JSON.stringify({ query, variables }))
}

export function downloadMultiple(filename, query, ids) {
  const zip = new JSZip()
  let counter = 0

  ids.forEach(id => {
    downloadData(data => {
      counter++
      zip.file(id + '.pdf', data.substring(data.indexOf(',') + 1), { base64: true })

      if (counter === ids.length) { // download zip
        zip.generateAsync({ type: 'base64' }).then(base64 => {
          createDownloadLink(('data:application/zip;base64,' + base64), filename).click()
        })
      }
    }, query, { id })
  })
}

export function download(filename, query, variables = undefined) {
  downloadData(data => {
    createDownloadLink(data, filename).click()
  }, query, variables)
}

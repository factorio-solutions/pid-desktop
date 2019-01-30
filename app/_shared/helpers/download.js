import localforage from 'localforage'

import FileSaver from 'file-saver'
import JSZip     from 'jszip'
import * as nav  from './navigation'

import { binaryToOctetStream } from './downloadXLSX'

// helper download file from API

// import { download }  from '../_shared/helpers/download'
// download ('HelloKity.pdf', "query { download_invoice }")


export async function downloadData(onSuccess, query, variables = undefined) {
  const entryPoint = (process.env.API_ENTRYPOINT || 'http://localhost:3000') + '/queries'

  const xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = async () => {
    if (xmlHttp.status === 401) { // unauthorized, navivate home
      localforage.removeItem('jwt')
      const redirect = await localforage.getItem('redirect')
      if (!redirect) {
        localforage.setItem('redirect', window.location.hash.substring(4, window.location.hash.indexOf('?')))
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
  xmlHttp.setRequestHeader('Authorization', 'Bearer ' + await localforage.getItem('jwt'))
  xmlHttp.send(JSON.stringify({ query, variables }))
}

export function downloadMultiple(filename, query, ids, fileNames = []) {
  const zip = new JSZip()
  let counter = 0

  ids.forEach((id, index) => {
    downloadData(data => {
      counter++
      zip.file((fileNames[index] || id) + '.pdf', data.substring(data.indexOf(',') + 1), { base64: true })

      if (counter === ids.length) { // download zip
        zip.generateAsync({ type: 'blob' }).then(blob => {
          FileSaver.saveAs(blob, filename)
        })
      }
    }, query, { id })
  })
}

export function download(filename, query, variables = undefined) {
  downloadData(dataURI => {
    const bytes = atob(dataURI.split(',')[1])
    const mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const buffer = binaryToOctetStream(bytes)
    const blob = new Blob([ buffer ], { type: mimeType })
    FileSaver.saveAs(blob, filename)
  }, query, variables)
}

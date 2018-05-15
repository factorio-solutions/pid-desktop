// import { get }  from '../_shared/helpers/get'
//
// get('public/image.svg')
export function get(url) {
  return new Promise(resolve => {
    const xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4) {
        resolve(xmlHttp.responseText)
      }
    }

    xmlHttp.open('GET', url, true)
    xmlHttp.setRequestHeader('Content-type', 'application/json')
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.jwt)
    xmlHttp.send()
  })
}

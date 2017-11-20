// import { get }  from '../_shared/helpers/get'
//
// get('public/image.svg')
export function get (url){
  return new Promise((resolve, reject) => {
    let xmlHttp = new XMLHttpRequest()

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4){
        resolve(xmlHttp.responseText)
      }
    }

    xmlHttp.open('GET', url, true)
    xmlHttp.setRequestHeader('Content-type', 'application/json')
    xmlHttp.send()
  });
}

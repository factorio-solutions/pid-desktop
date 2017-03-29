// Will create with parameters from URL

export function parseParameters (url) {
  return url.split('?')[1]
            .split('&')
            .reduce((obj, parameter)=>{
    obj[parameter.split('=')[0]] = parameter.split('=')[1]
    return obj
  }, {})
}

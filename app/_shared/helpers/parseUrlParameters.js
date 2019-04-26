// Will create with parameters from URL

export function parseParameters(url) {
  const parameters = url.split('?')[1]
  if (!parameters) {
    return {}
  }
  return parameters
    .split('&')
    .reduce((obj, parameter) => {
      obj[parameter.split('=')[0]] = parameter.split('=')[1]
      return obj
    }, {})
}

export function composeParameters(obj) {
  return Object.keys(obj)
  .filter(key => key !== '_k' && key !== '') // remove empty keys, Router hashes
  .map(key => encodeURI(`${key}=${obj[key]}`))
  .join('&')
}

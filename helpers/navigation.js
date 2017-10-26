import translate from 'counterpart'
import { hashHistory } from 'react-router'
import { composeParameters, parseParameters } from './parseUrlParameters'


export function path(dest) {
  return `/${translate.getLocale()}${dest}`
}

export function to(dest) {
  hashHistory.push(path(dest))
}

export function back() {
  hashHistory.goBack()
}

export function changeLanguage(language) {
  hashHistory.push(`${language}${window.location.hash.substr(4).split('?')[0]}?${composeParameters(parseParameters(window.location.hash))}`)
}

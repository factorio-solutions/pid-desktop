import translate from 'counterpart'
import { history } from '../../_store/configureStore'
import { composeParameters, parseParameters } from './parseUrlParameters'


export function path(dest) {
  return `/${translate.getLocale()}${dest}`
}

export function to(dest) {
  history.push(path(dest))
}

export function back() {
  history.goBack()
}

export function changeLanguage(language) {
  const split = window.location.hash.substr(4).split('?')
  history.push(`/${language}${split[0]}${split[1] ? '?' + split[1] : ''}`)
}

import translate from 'counterpart'
import { hashHistory } from 'react-router'


export function path(dest) {
  return `${translate.getLocale()}${dest}`
}

export function to(dest) {
  hashHistory.push(path(dest))
}

export function toAbsolute(dest) {
  hashHistory.push(dest)
}

export function back() {
  hashHistory.goBack()
}

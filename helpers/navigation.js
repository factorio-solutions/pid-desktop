import translate       from 'counterpart'
import { hashHistory } from 'react-router'

export function to (dest) {
  hashHistory.push(path(dest))
}

export function path (dest) {
  return `${translate.getLocale()}${dest}`
}

export function back(){
  hashHistory.goBack()
}

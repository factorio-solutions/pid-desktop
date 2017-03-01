import translate       from 'counterpart'
import { hashHistory } from 'react-router'

export function to (dest) {
  hashHistory.push(path(dest))
}

export function path (dest) {
  return `${translate.getLocale()}${dest}`
}

<<<<<<< HEAD
export function back(){
=======
export function back (){
>>>>>>> feature/new_api
  hashHistory.goBack()
}

import React  from 'react'
import { t }    from '../../modules/localization/localization'
import styles from './Loading.scss'

// Super of all buttons
// content = ...
// onClick = ...
// type = what action is button for, if 'remove' than shows confirm alert
// state = what state is button in. If has state, than no onClick will be performed
// style = looks of button - defined by extenders
// question = text of confirm window when type == 'remove'


export default function Loading({ show }) {
  return show ? (
    <span>
      <span className={`fa fa-spinner ${styles.rotating}`} aria-hidden="true" />
      <span>{t([ 'signup_page', 'loading' ])}</span>
    </span>
  ) : null
}

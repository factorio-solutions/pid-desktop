import React from 'react'

import { t } from '../../../_shared/modules/localization/localization'

import styles from './Span.scss'


export default function AttributeSpan({ state, attribute, label, actions, highlight }) {
  return <span
    className={`${state[attribute] ? styles.boldText : styles.inactiveText} ${highlight && styles.highlight}`}
    onClick={() => actions.setBooleanAttr(attribute, !state[attribute])}
  >
    { t([ 'inviteUser', label ]) }
  </span>
}

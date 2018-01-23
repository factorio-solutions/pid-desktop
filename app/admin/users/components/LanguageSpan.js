
import React from 'react'

import { t } from '../../../_shared/modules/localization/localization'

import styles from './Span.scss'


export default function LanguageSpan({ state, lang, actions }) {
  return <span
    className={state.language === lang ? styles.boldText : styles.inactiveText}
    onClick={() => actions.setLanguage(lang)}
  >
    {t([ 'languages', lang ])}
  </span>
}

import React from 'react'
import styles from './CallToActionButton.scss'

import Button from './Button.js'


// extends Button.js
// state = 'selected', 'disabled'


export default function CallToActionButton({ label, onClick, state, type }) {
  const style = [ styles.button,
    styles[state],
    styles[type]
  ].join(' ')

  const content = <span className={styles.label}>{label}</span>

  return (
    <Button content={content} onClick={onClick} state={state} style={style} type={type} />
  )
}

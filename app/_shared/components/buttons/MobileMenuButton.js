import React from 'react'
import styles from './MobileMenuButton.scss'
import Button from './Button.js'

// extends Button.js
// type = 'action', 'confirm', 'remove'
// size = 'collapsed'
// state = 'selected', 'disabled'
// question = confirmation text for remove type button


export default function MobileMenuButton({ icon, label, onClick, type, state, size, question }) {
  const style = [
    styles.button,
    styles[type],
    styles[state],
    !icon && styles.adjustPadding
  ].join(' ')

  const content = (<div className={styles.centerInDiv} >
    <i className={`${icon} ${styles.icon} ${styles.content}`} aria-hidden="true" />
    <span className={`${styles.label} ${styles.content}`}>{label}</span>
  </div>)

  return (
    <Button content={content} onClick={onClick} type={type} state={state} style={style} question={question} />
  )
}

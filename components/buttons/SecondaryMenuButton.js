import React from 'react'
import styles from './SecondaryMenuButton.scss'
import Button from './Button.js'

// extends Button.js
// type = 'action', 'confirm', 'remove'
// state = 'selected', 'disabled'

export default function SecondaryMenuButton({ label, onClick, type, state }) {
  const style = [
    styles.button,
    styles[type],
    styles[state]
  ].join(' ')

  const content = (<div className={styles.container}>
    <div className={`${styles.label}`}>{label}</div>
  </div>)

  return (
    <Button content={content} onClick={onClick} type={type} state={state} style={style} />
  )
}

import React from 'react'
import styles from './TabButton.scss'
import Button from './Button.js'

// extends Button.js
// state = 'selected'

export default function TabButton({ label, onClick, onDisabledClick, state }) {
  const style = [
    styles.button,
    styles[state]
  ].join(' ')

  const content = <div className={`${styles.label}`}>{label}</div>

  return (
    <Button content={content} onClick={state !== 'selected' ? onClick : onDisabledClick} state={state} style={style} />
  )
}

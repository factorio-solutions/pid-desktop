import React from 'react'

import Button from './Button.js'

import styles from './TabButton.scss'

// extends Button.js
// state = 'selected'


export default function TabButton({ label, onClick, onDisabledClick, state }) {
  const style = [
    styles.button,
    styles[state]
  ].join(' ')

  const content = <div className={styles.label}>{label}</div>

  const handleClick = state === 'selected'
    ? onDisabledClick
    : onClick

  return (
    <Button
      style={style}
      content={content}
      onClick={handleClick}
      state={state}
    />
  )
}

TabButton.propTypes = {
  label:           React.PropTypes.string,
  onClick:         React.PropTypes.func,
  onDisabledClick: React.PropTypes.func,
  state:           React.PropTypes.string
}

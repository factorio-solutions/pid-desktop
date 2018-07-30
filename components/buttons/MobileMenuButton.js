import React from 'react'

import Button from './Button.js'

import styles from './MobileMenuButton.scss'

// extends Button.js
// type = 'action', 'confirm', 'remove'
// size = 'collapsed'
// state = 'selected', 'disabled'
// question = confirmation text for remove type button


export default function MobileMenuButton({ icon, label, ...restOfProps }) {
  const style = [
    styles.button,
    styles[restOfProps.type],
    styles[restOfProps.state],
    !icon && styles.adjustPadding
  ].join(' ')

  const content = (
    <div className={styles.centerInDiv}>
      <i className={`${icon} ${styles.icon} ${styles.content}`} aria-hidden="true" />
      <span className={styles.content}>{label}</span>
    </div>
  )

  return (
    <Button
      {...restOfProps}
      content={content}
      style={style}
    />
  )
}

MobileMenuButton.propTypes = {
  icon:     React.PropTypes.string,
  label:    React.PropTypes.string,
  onClick:  React.PropTypes.func,
  type:     React.PropTypes.string,
  state:    React.PropTypes.string,
  size:     React.PropTypes.string,
  question: React.PropTypes.string
}

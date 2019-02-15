import PropTypes from 'prop-types'
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
  icon:     PropTypes.string,
  label:    PropTypes.string,
  onClick:  PropTypes.func,
  type:     PropTypes.string,
  state:    PropTypes.string,
  size:     PropTypes.string,
  question: PropTypes.string
}

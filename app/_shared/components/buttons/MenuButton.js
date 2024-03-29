import PropTypes from 'prop-types'
import React from 'react'

import Button from './Button.js'

import styles from './MenuButton.scss'

// extends Button.js
// type = 'action', 'confirm', 'remove'
// state = 'selected', 'disabled'


export default function MenuButton({ icon, label, ...restOfProps }) {
  const style = [
    styles.button,
    styles[restOfProps.type],
    styles[restOfProps.state]
  ].join(' ')

  const content = (
    <div>
      <i className={`${icon} ${styles.icon}`} aria-hidden="true" />
      <div className={`${styles.label}`}>{label}</div>
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

MenuButton.propTypes = {
  icon:    PropTypes.string,
  label:   PropTypes.string,
  onClick: PropTypes.func,
  type:    PropTypes.string,
  state:   PropTypes.string
}

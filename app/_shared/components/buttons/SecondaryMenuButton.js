import PropTypes from 'prop-types'
import React from 'react'

import Button from './Button.js'

import styles from './SecondaryMenuButton.scss'

// extends Button.js
// type = 'action', 'confirm', 'remove'
// state = 'selected', 'disabled'


export default function SecondaryMenuButton({ label, ...restOfProps }) {
  const style = [
    styles.button,
    styles[restOfProps.type],
    styles[restOfProps.state]
  ].join(' ')

  const content = (
    <div className={styles.container}>
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

SecondaryMenuButton.propTypes = {
  label:   PropTypes.string,
  onClick: PropTypes.func,
  type:    PropTypes.string,
  state:   PropTypes.string
}

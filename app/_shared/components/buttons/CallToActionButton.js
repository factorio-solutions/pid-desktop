import PropTypes from 'prop-types'
import React from 'react'

import Button from './Button.js'

import styles from './CallToActionButton.scss'

// extends Button.js
// state = 'selected', 'disabled'


export default function CallToActionButton({ label, ...props }) {
  const style = [
    styles.button,
    styles[props.state],
    styles[props.type]
  ].join(' ')

  const content = <span className={styles.label}>{label}</span>

  return (
    <Button
      {...props}
      content={content}
      style={style}
    />
  )
}

CallToActionButton.propTypes = {
  label:       PropTypes.string,
  onClick:     PropTypes.func,
  state:       PropTypes.string,
  type:        PropTypes.string,
  onMouseDown: PropTypes.func
}

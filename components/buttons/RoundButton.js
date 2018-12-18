import React, { PropTypes } from 'react'

import Button from './Button.js'

import styles from './RoundButton.scss'

// extends Button.js
// type = undefined => default black, 'action' => blue, 'confirm' => green, 'remove' => red
// size ='big'
// question = confirmation text for remove type button


export default function RoundButton(props) {
  const { state, size, type } = props

  const style = [
    styles.button,
    styles[state],
    styles[size],
    !state && styles[type]
  ].join(' ')

  return (
    <Button
      {...props}
      style={style}
    />
  )
}

RoundButton.propTypes = {
  content:         PropTypes.object,
  onClick:         PropTypes.func,
  onDisabledClick: PropTypes.func,
  type:            PropTypes.string,
  state:           PropTypes.string,
  size:            PropTypes.string,
  question:        PropTypes.string
}

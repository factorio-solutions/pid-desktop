import PropTypes from 'prop-types'
import React from 'react'

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
  content: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  onClick:         React.PropTypes.func,
  onDisabledClick: React.PropTypes.func,
  type:            React.PropTypes.string,
  state:           React.PropTypes.string,
  size:            React.PropTypes.string,
  question:        React.PropTypes.string
}

import PropTypes from 'prop-types'
import React from 'react'

import Button from './Button.js'

import styles from './ButtonGroup.scss'


export default function ButtonGroupButton({ state, ...restOfProps }) {
  const style = [
    styles.button,
    styles[state]
  ].join(' ')

  return (<Button
    {...restOfProps}
    style={style}
  />)
}

ButtonGroupButton.propTypes = {
  content: PropTypes.object,
  onClick: PropTypes.func,
  state:   PropTypes.string
}

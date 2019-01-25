import PropTypes from 'prop-types'
import React from 'react'

import Button from '../buttons/Button'

import styles from './I.scss'


export default function I({ onClick, size }) {
  const style = [
    styles.button,
    onClick && styles.clickable,
    styles[size]
  ].join(' ')

  const content = <i className="fa fa-info" aria-hidden="true" />

  return (
    <Button
      content={content}
      onClick={onClick}
      style={style}
    />
  )
}

I.propTypes = {
  onClick: PropTypes.func,
  size:    PropTypes.string
}

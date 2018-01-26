import React, { Component, PropTypes } from 'react'

import Button from '../buttons/Button'

import styles from './I.scss'


export default class I extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    size:    PropTypes.string
  }

  static defaultProps = {
    onClick: undefined,
    size:    '' // or 'small'
  }

  render() {
    const { onClick, size } = this.props

    const style = [
      styles.button,
      onClick && styles.clickable,
      styles[size]
    ]

    return (
      <Button content={<i className="fa fa-info" aria-hidden="true" />} onClick={onClick} style={style.join(' ')} />
    )
  }
}

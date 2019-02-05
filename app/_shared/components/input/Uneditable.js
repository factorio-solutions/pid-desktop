import PropTypes from 'prop-types'
import React, { Component } from 'react'

import styles from './Uneditable.scss'


export default class Uneditable extends Component {
  static propTypes = {
    label:     PropTypes.string.isRequired,
    highlight: PropTypes.bool,
    value:     PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  render() {
    const { label, value, highlight } = this.props

    return (
      <div className={`${styles.container} ${highlight && styles.highlight}`} >
        <div>{value}</div>
        <label className={styles.label}>{label}</label>
      </div>
    )
  }
}

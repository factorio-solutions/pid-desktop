import React, { Component, PropTypes } from 'react'

import styles from './Uneditable.scss'


export default class Uneditable extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  render() {
    const { label, value } = this.props

    return (
      <div className={`${styles.container}`} >
        <div>{value}</div>
        <label className={styles.label}>{label}</label>
      </div>
    )
  }
}

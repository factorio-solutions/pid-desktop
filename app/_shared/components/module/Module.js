import PropTypes from 'prop-types'
import React, { Component } from 'react'

import styles       from './Module.scss'


export default class Module extends Component {
  static propTypes = {
    name:        PropTypes.string.isRequired,
    description: PropTypes.func,
    disabled:    PropTypes.bool,
    actions:     PropTypes.object
  }

  static defaultProps = {
    disabled: false
  }

  render() {
    const { name, description, disabled, actions } = this.props

    return (
      <div className={`${styles.container} ${disabled && styles.disabled}`}>
        <div>
          <div>{name}</div>
          <div>{description}</div>
        </div>
        <div>{actions}</div>
      </div>
    )
  }
}

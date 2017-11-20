import React, { Component, PropTypes } from 'react'

import RoundButton  from '../buttons/RoundButton'

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

  render(){
    const { name, description, disabled, actions } = this.props

    return(
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

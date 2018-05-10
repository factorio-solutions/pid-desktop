import React, { Component, PropTypes } from 'react'

import styles from './Checkbox.scss'


export default class Checkbox extends Component {
  static propTypes = {
    children: PropTypes.object,
    checked:  PropTypes.bool,
    onChange: PropTypes.func
  }

  onEnter = event => event.keyCode === 13 && this.props.onChange(!event.target.checked)

  onClick = event => this.props.onChange(event.target.checked)

  render() {
    const { children, checked } = this.props

    return (
      <div className={styles.checkbox}>
        <input type="checkbox" checked={checked} onChange={this.onClick} onKeyUp={this.onEnter} />
        <span>{children}</span>
      </div>
    )
  }
}

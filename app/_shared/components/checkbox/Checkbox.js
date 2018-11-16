import React, { Component, PropTypes } from 'react'

import defaultStyles from './Checkbox.scss'


export default class Checkbox extends Component {
  static propTypes = {
    children: PropTypes.object,
    checked:  PropTypes.bool,
    onChange: PropTypes.func,
    style:    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ])
  }

  onEnter = event => event.keyCode === 13 && this.props.onChange(!event.target.checked)

  onClick = event => this.props.onChange(event.target.checked)

  render() {
    const { children, checked, style } = this.props

    const styles = typeof style === 'object' ? style : defaultStyles

    return (
      <div role="presentation" className={styles.checkbox} onClick={this.onClick} onKeyUp={this.onEnter} >
        <input type="checkbox" checked={checked} />
        <label>{children}</label>
      </div>
    )
  }
}

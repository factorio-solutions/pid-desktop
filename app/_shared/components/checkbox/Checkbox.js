import PropTypes from 'prop-types'
import React, { Component } from 'react'

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

  constructor(props) {
    super(props)

    this.checkbox = React.createRef()
  }

  onEnter = event => event.keyCode === 13 && this.props.onChange(!event.target.checked)

  onChange = () => this.props.onChange(this.checkbox.current.checked)

  render() {
    const { children, checked, style } = this.props

    const styles = typeof style === 'object' ? style : defaultStyles

    return (
      <div
        role="presentation"
        className={styles.checkbox}
        onClick={this.onChange}
        onKeyUp={this.onEnter}
      >
        <input
          type="checkbox"
          checked={checked}
          ref={this.checkbox}
          onChange={this.onChange}
          key="checkbox"
        />
        <label key="label">
          <span style={{ verticalAlign: 'bottom' }}>{children}</span>
        </label>
      </div>
    )
  }
}

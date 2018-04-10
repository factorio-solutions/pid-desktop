import React, { Component, PropTypes } from 'react'
import styles                          from './Checkbox.scss'

export default class Checkbox extends Component {
  static propTypes = {
    children:  PropTypes.object,
    checked:   PropTypes.bool,
    onChange:  PropTypes.func,
    highlight: PropTypes.bool
  }

  render() {
    const { children, checked, onChange, highlight } = this.props

    const onEnter = e => {
      if (e.keyCode === 13) {
        onChange()
      }
    }

    return (
      <div className={`${styles.checkbox} ${!checked && highlight && styles.highlight}`}>
        <input type="checkbox" checked={checked} onChange={onChange} onKeyUp={onEnter} />
        <span>{children}</span>
      </div>
    )
  }
}

import React, { Component, PropTypes } from 'react'
import styles                          from './checkbox.scss'

export default class Checkbox extends Component {
  static propTypes = {
    children: PropTypes.object,
    checked:  PropTypes.bool,
    onChange: PropTypes.func
  }

  render() {
    const { children, checked, onChange } = this.props

    const onEnter = e => {
      if (e.keyCode === 13) {
        onChange()
      }
    }

    return (
      <div className={styles.checkbox}>
        <input type="checkbox" checked={checked} onChange={onChange} onKeyUp={onEnter} />
        <span>{children}</span>
      </div>
    )
  }
}

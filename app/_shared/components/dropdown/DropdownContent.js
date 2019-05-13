import PropTypes from 'prop-types'
import React, { Component } from 'react'

import styles from './Dropdown.scss'


// label = button label if no item selected
// content = dropdown content, structure: [{label: ..., onClick: ... }, ... ]
// style = sets style, can be 'dark'/'light' (default is 'dark'), more can be created
// selected = index of select item in content
// fillParent = flag to indicate whenever or not to fill parent element widthvise

export default class DropdownContent extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    content:  PropTypes.array.isRequired,
    style:    PropTypes.string
  }

  static defaultProps = { style: '' }

  constructor(props) {
    super(props)

    this.containerRef = React.createRef()

    this.state = {
      hide: true
    }
  }

  handleClick = e => {
    if (this.containerRef.current && !this.containerRef.current.contains(e.target)) {
      this.hide()
    }
  }

  toggleDropdown = () => {
    const { hide } = this.state
    hide ? this.unhide() : this.hide()
  }

  hide = () => {
    this.setState(state => ({ ...state, hide: true }))
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  unhide = () => {
    this.setState(state => ({ ...state, hide: false }))
    document.addEventListener('mousedown', this.handleClick, false)
  }

  handleListClick = () => this.hide()

  render() {
    const { content, style, children } = this.props
    const { hide } = this.state

    const ulClassName = [
      style,
      styles.drop,
      hide && styles.hidden,
      hide && styles.displayNone
    ]
      .filter(s => s)
      .join(' ')

    return (
      <div ref={this.containerRef}>
        <div key="Div_on_click" onClick={this.toggleDropdown}>
          {children}
        </div>
        <ul
          key="content_list"
          className={ulClassName}
          onClick={this.handleListClick}
        >
          {content}
        </ul>
      </div>
    )
  }
}

import React, { Component, PropTypes }  from 'react'

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

  toggleDropdown = () => {
    this.ul.classList.contains(styles.hidden) ? this.unhide() : this.hide()
  }

  hide = () => {
    this.ul.classList.add(styles.hidden)
    setTimeout(() => { this.ul.classList.add(styles.displayNone) }, 250)
  }

  unhide = () => {
    this.ul.classList.remove(styles.displayNone)
    this.ul.classList.remove(styles.hidden)
  }

  render() {
    const { content, style, children } = this.props

    const hideDropdown = row => {
      return { ...row,
        onClick: () => {
          this.hide()
          row.onClick()
        } }
    }

    return (
      <div>
        <div onClick={this.toggleDropdown}>
          {children}
        </div>
        <ul className={`${style} ${styles.drop} ${styles.hidden} ${styles.displayNone}`} ref={ul => { this.ul = ul }}>
          {content.map(hideDropdown)}
        </ul>
      </div>
    )
  }
}

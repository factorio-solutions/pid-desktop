import React, { Component, PropTypes }  from 'react'
import ReactDOM                         from 'react-dom'

import styles from './Dropdown.scss'


// label = button label if no item selected
// content = dropdown content, structure: [{label: ..., onClick: ... }, ... ]
// style = sets style, can be 'dark'/'light' (default is 'dark'), more can be created
// selected = index of select item in content
// fillParent = flag to indicate whenever or not to fill parent element widthvise
// position 'fixed' / 'absolute' => default: 'absolute'

export default class Dropdown extends Component {
  static propTypes = {
    label:     PropTypes.string.isRequired,
    content:   PropTypes.array.isRequired,
    style:     PropTypes.string,
    selected:  PropTypes.number,
    onChange:  PropTypes.func,
    fixed:     PropTypes.bool,
    highlight: PropTypes.bool,
    position:  PropTypes.string,
    editable:  PropTypes.bool
  }

  static defaultProps = {
    hover:    false,
    style:    'dark',
    editable: true
  }

  constructor(props) {
    super(props)
    this.state = { selected: this.props.selected }
  }

  componentDidMount() {
    this.validateContent(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.validateContent(nextProps)
  }

  validateContent(nextProps) {
    if (nextProps.content.length === 1) { // if only one item, autoselect it
      this.setState({ selected: 0 })
    } else {
      this.setState({ selected: nextProps.selected })
    }
  }

  toggleDropdown = () => {
    this.ul.classList.contains(styles.hidden) ? this.unhide() : this.hide()
  }

  hide = () => {
    this.ul.classList.add(styles.hidden)
    setTimeout(() => {
      this.ul.classList.add(styles.display)
    }, 250)
  }

  unhide = () => {
    if (this.props.content.length > 1) {
      this.ul.classList.remove(styles.display)
      this.ul.classList.remove(styles.hidden)
      this.ul.style.width = this.button.getBoundingClientRect().width + 'px'
    }
  }

  render() {
    const { label, content, style, onChange, highlight, position, editable } = this.props

    const prepareContent = (item, index) => {
      const onClick = e => {
        e.stopPropagation()
        item.onClick && item.onClick()
        this.setState({ selected: index })
        onChange && onChange(index, true)// for form
        this.hide()
      }

      return (
        <li key={index} className={index === this.state.selected ? styles.selected : ''} onClick={onClick} >
          <label>
            {item.label}
          </label>
        </li>
      )
    }



    return (
      <div>
        <button
          type="button"
          className={`${styles.button} ${styles[style]} ${highlight && (this.state.selected === -1 || this.state.selected === undefined) && styles.highlighted} ${!editable && styles.dimmer}`}
          onClick={editable && this.toggleDropdown}
          onBlur={this.hide}
          ref={button => { this.button = button }}
        >
          <span className={styles.marginCorrection}> {this.state.selected === undefined || content[this.state.selected] === undefined ? label : content[this.state.selected].label} </span>
          <i className={`fa fa-caret-down ${styles.float} ${content.length > 1 && styles.visible}`} aria-hidden="true" />
        </button>
        <ul
          className={`${styles.drop} ${styles.hidden} ${styles.display} ${position === 'fixed' ? styles.fixed : styles.absolute}`}
          ref={ul => { this.ul = ul }}
        >
          {content.map(prepareContent)}
        </ul>
      </div>
    )
  }
}

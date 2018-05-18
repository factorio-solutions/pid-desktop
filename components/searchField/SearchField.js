import React, { Component, PropTypes } from 'react'

import CallToActionButton from '../buttons/CallToActionButton'

import styles from './SearchField.scss'


// label = button label if no item selected
// content = dropdown content, structure: [{label: ..., onClick: ... }, ... ]
// style = sets style, can be 'dark'/'light' (default is 'dark'), more can be created
// selected = index of select item in content
// fillParent = flag to indicate whenever or not to fill parent element widthvise
// position 'fixed' / 'absolute' => default: 'absolute'

export default class SearchField extends Component {
  static propTypes = {
    label:       PropTypes.string.isRequired,
    content:     PropTypes.array.isRequired,
    style:       PropTypes.string,
    selected:    PropTypes.number,
    onChange:    PropTypes.func,
    highlight:   PropTypes.bool,
    position:    PropTypes.string,
    editable:    PropTypes.bool,
    order:       PropTypes.bool,
    buttons:     PropTypes.array,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    hover:    false,
    style:    'dark',
    editable: true,
    order:    true
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: this.props.selected,
      filter:   ''
    }
  }

  componentDidMount() {
    this.validateContent(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.validateContent(nextProps)
  }

  handleSelection() {
    const user = this.props.content[this.state.selected]
    if (user) {
      this.setState({ ...this.state, filter: user.label })
    } else {
      this.filter.focus()
    }
  }

  validateContent(nextProps) {
    if (nextProps.content.length === 1) { // if only one item, autoselect it
      this.setState({ ...this.state, selected: 0 }, this.handleSelection)
    } else {
      this.setState({ ...this.state, selected: nextProps.selected }, this.handleSelection)
    }
  }

  toggleDropdown = () => {
    this.ul.classList.contains(styles.hidden) ? this.unhide() : this.hide()
  }

  hide = () => {
    this.ul.classList.add(styles.hidden)
    this.timeout = setTimeout(() => {
      this.ul && this.ul.classList.add(styles.displayNone)
    }, 250)
  }

  unhide = () => {
    if (this.props.content.length > 1) {
      this.ul.classList.remove(styles.displayNone)
      this.ul.classList.remove(styles.hidden)
      this.ul.style.width = this.filter.getBoundingClientRect().width + 'px'

      if (this.props.filter) {
        this.filter.focus()
      }
    }
  }

  filterChange = event => this.setState({ ...this.state, filter: event.target.value })

  render() {
    const { label, content, onChange, style, position, buttons, placeholder, editable } = this.props
    let buttonsArray = []

    const sorter = (a, b) =>
    (a.order || b.order) ?
      ((a.order && !b.order) ? -1 : (!a.order && b.order) ? 1 : a.order - b.order) :
      (a.label.toString() || '').toLowerCase() < (b.label.toString() || '').toLowerCase() ?
        -1 :
        ((a.label.toString() || '').toLowerCase() > (b.label.toString() || '').toLowerCase() ? 1 : 0)

    let list = content.sort(sorter).map((item, index) => {
      console.log(item)

      const onClick = e => {
        e.stopPropagation()
        item.onClick && item.onClick()
        onChange && onChange(index, true) // for form
        // HACK: filter is not set without setTimeout.
        setTimeout(() => this.setState({ ...this.state, selected: index, filter: item.label }), 0)
        this.hide()
      }
      const lowercaseTrimmedLabel = item.label.toString().replace(/\s\s+/g, ' ').trim().toLowerCase()
      const show = this.state.filter === '' ? true : lowercaseTrimmedLabel.includes(this.state.filter.toLowerCase())

      return {
        ...item,
        render: (
          <li
            key={index}
            className={`${index === this.state.selected && styles.selected} ${!show && styles.displayNone}`}
            onClick={onClick}
          >
            <label>
              {item.representer ? item.representer(item.label) : lowercaseTrimmedLabel
                .split(this.state.filter.toLowerCase() || undefined) // split by filter
                .reduce((acc, item, index, arr) => [ ...acc, item, index <= arr.length - 2 && this.state.filter.length && this.state.filter ], [])
                .filter(o => o !== false)
                .reduce((acc, item, index) => [ ...acc, (acc[index - 1] || 0) + item.length ], [])
                .map((length, index, arr) => String(item.label).substring(arr[index - 1] || 0, length))
                .map((part, index) => (index % 2 === 0 ? <span>{part}</span> : <b>{part}</b>))
              }
            </label>
          </li>)
      }
    })

    if (buttons) {
      buttonsArray = buttons.map(item => {
        return (
          <div className={styles.line}>
            <div className={styles.minWidthButton}>
              <CallToActionButton
                label={item.label}
                onClick={item.onClick}
              />
            </div>
            <div>{item.text}</div>
          </div>
        )
      })
    }
    list = list.map(o => o.render)
    return (
      <div>
        <input
          type="text"
          value={this.state.filter}
          placeholder={placeholder}
          onChange={this.filterChange}
          ref={el => { this.filter = el }}
          label={label}
          className={`${styles.filter} ${!editable && styles.dimmer}`}
          onFocus={this.toggleDropdown}
          onBlur={this.toggleDropdown}
        />
        <div
          className={`${styles.drop} ${styles.hidden} ${styles.displayNone} ${position === 'fixed' ? styles.fixed : styles.absolute}`}
          ref={ul => { this.ul = ul }}
        >
          <ul className={styles.scrollable}>
            {list}
          </ul>
          {buttonsArray.length > 0 &&
            <div className={styles.buttons}>
              {buttonsArray}
            </div>
          }
        </div>
      </div>
    )
  }
}

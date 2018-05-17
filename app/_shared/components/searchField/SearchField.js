import React, { Component, PropTypes } from 'react'

import styles from './SearchField.scss'


// label = button label if no item selected
// content = dropdown content, structure: [{label: ..., onClick: ... }, ... ]
// style = sets style, can be 'dark'/'light' (default is 'dark'), more can be created
// selected = index of select item in content
// fillParent = flag to indicate whenever or not to fill parent element widthvise
// position 'fixed' / 'absolute' => default: 'absolute'

export default class SearchField extends Component {
  static propTypes = {
    label:     PropTypes.string.isRequired,
    content:   PropTypes.array.isRequired,
    style:     PropTypes.string,
    selected:  PropTypes.number,
    onChange:  PropTypes.func,
    highlight: PropTypes.bool,
    position:  PropTypes.string,
    editable:  PropTypes.bool,
    filter:    PropTypes.bool,
    order:     PropTypes.bool
  }

  static defaultProps = {
    hover:    false,
    style:    'dark',
    editable: true,
    filter:   false,
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

  validateContent(nextProps) {
    if (nextProps.content.length === 1) { // if only one item, autoselect it
      this.setState({ ...this.state, selected: 0 })
    } else {
      this.setState({ ...this.state, selected: nextProps.selected })
    }
  }

  toggleDropdown = () => {
    this.ul.classList.contains(styles.hidden) ? this.unhide() : this.hide()
  }

  hide = () => {
    this.ul.classList.add(styles.hidden)
    this.timeout = setTimeout(() => {
      this.setState({ ...this.state, filter: '' })
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

  // filterChange = event => this.setState({ ...this.state, filter: event.target.value })

  render() {
    const { label, content, onChange, style, position } = this.props
    let list = content.map((item, index) => {
      const onClick = e => {
        e.stopPropagation()
        item.onClick && item.onClick()
        this.setState({ ...this.state, selected: index })
        onChange && onChange(index, true) // for form
        console.log(this.filter)
        console.log(item.label)
        this.filter.value = item.label
        console.log(this.filter)
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
    const filterChange = event => this.setState({ ...this.state, filter: event.target.value })
    list = list.map(o => o.render)
    return (
      <div>
        <input
          type="search"
          value={this.state.filter}
          onChange={filterChange}
          ref={el => { this.filter = el }}
          label={label}
          className={styles.filter}
          onFocus={this.toggleDropdown}
          onBlur={this.toggleDropdown}
        />
        <div
          className={`${styles.drop} ${styles.hidden} ${styles.displayNone} ${position === 'fixed' ? styles.fixed : styles.absolute}`}
          ref={ul => { this.ul = ul }}
        >
          <ul>
            {list}
            <li>
              <button>Ahoj0</button>
            </li>
            <li>
              <button>Ahoj1</button>
            </li>
            <li>
              <button>Ahoj2</button>
            </li>
          </ul>
          <ul>
            
          </ul>
        </div>
      </div>
    )
  }
}

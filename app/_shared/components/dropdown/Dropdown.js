import React, { Component, PropTypes } from 'react'

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
      this.ul.style.width = this.button.getBoundingClientRect().width + 'px'

      if (this.props.filter) {
        this.filter.focus()
      }
    }
  }

  render() {
    const { label, content, style, onChange, highlight, position, editable, filter, order } = this.props

    let lis = content.map((item, index) => {
      const onClick = e => {
        e.stopPropagation()
        item.onClick && item.onClick()
        this.setState({ ...this.state, selected: index })
        onChange && onChange(index, true) // for form
        this.hide()
      }

      const lowercaseTrimmedLabel = item.label.toString().replace(/\s\s+/g, ' ').trim().toLowerCase()
      const show = this.state.filter === '' ? true : lowercaseTrimmedLabel.includes(this.state.filter.toLowerCase())

      return {
        ...item,
        render: (<li key={index} className={`${index === this.state.selected && styles.selected} ${!show && styles.displayNone}`} onClick={onClick} >
          <label>
            {item.representer ? item.representer(item.label) : lowercaseTrimmedLabel
              .split(this.state.filter.toLowerCase() || undefined) // split by filter
              .reduce((acc, item, index, arr) => [ ...acc, item, index <= arr.length - 2 && this.state.filter.length && this.state.filter ], [])
              .filter(o => o !== false)
              .reduce((acc, item, index) => [ ...acc, (acc[index - 1] || 0) + item.length ], [])
              .map((length, index, arr) => String(item.label).substring(arr[index - 1] || 0, length))
              .map((part, index) => index % 2 === 0 ? <span key={index}>{part}</span> : <b key={index}>{part}</b>)
            }
          </label>
        </li>)
      }
    })


    // if object has first: true - then push it to the top
    const sorter = (a, b) =>
    (a.order || b.order) ?
      ((a.order && !b.order) ? -1 : (!a.order && b.order) ? 1 : a.order - b.order) :
      (a.label.toString() || '').toLowerCase() < (b.label.toString() || '').toLowerCase() ?
        -1 :
        ((a.label.toString() || '').toLowerCase() > (b.label.toString() || '').toLowerCase() ? 1 : 0)

    if (order) { // order if needed
      lis = lis.sort(sorter)
    }

    lis = lis.map(o => o.render) // render renderable part of object

    if (filter) { // add filter if wanted
      const filterChange = event => this.setState({ ...this.state, filter: event.target.value })
      const onFocus = () => {
        clearTimeout(this.timeout)
        this.unhide()
      }

      lis.unshift(<li className={styles.filter}>
        <input type="search" value={this.state.filter} onChange={filterChange} onFocus={onFocus} onBlur={this.hide} ref={el => { this.filter = el }} />
        <i className="fa fa-search" aria-hidden="true" />
      </li>)
    }

    return (
      <div className={styles.dropdownContainter}>
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
          className={`${styles.drop} ${styles.hidden} ${styles.displayNone} ${position === 'fixed' ? styles.fixed : styles.absolute}`}
          ref={ul => { this.ul = ul }}
        >
          {lis}
        </ul>
      </div>
    )
  }
}

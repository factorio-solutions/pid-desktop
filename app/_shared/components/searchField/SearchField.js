import React, { Component, PropTypes } from 'react'

import CallToActionButton from '../buttons/CallToActionButton'
import Input              from '../input/Input'

import styles from './SearchField.scss'

import inputStyles from '../input/ReservationInput.scss'


export default class SearchField extends Component {
  static propTypes = {
    dropdownContent: PropTypes.array.isRequired,
    searchQuery:     PropTypes.string,
    selected:        PropTypes.number,
    onChange:        PropTypes.func,
    buttons:         PropTypes.array,
    placeholder:     PropTypes.string,
    highlight:       PropTypes.bool,
    separateFirst:   PropTypes.bool
  }

  static defaultProps = {
    buttons: []
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: this.props.selected,
      show:     true
    }
  }

  componentDidMount() {
    if (!this.props.searchQuery) {
      this.filter.input.focus()
    }
    this.validateContent(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.validateContent(nextProps)
  }

  validateContent(nextProps) {
    const selected = nextProps.dropdownContent.length === 1 ? 0 : nextProps.selected
    const show = this.state.selected !== nextProps.selected && nextProps.selected >= 0 ?
      false :
      this.state.show

    if (selected !== this.state.selected || show !== this.state.show) {
      this.setState({
        ...this.state,
        selected,
        show
      })
    }
  }

  hide = () => setTimeout(
    () => this.setState({
      ...this.state,
      show: false
    }),
    100
  )

  show = () => {
    this.setState({
      ...this.state,
      show: true
    })
  }

  generateButtons = item => (
    <tr>
      <td><CallToActionButton label={item.label} onMouseDown={item.onClick} /></td>
      <td>{item.text}</td>
    </tr>
  )

  sorter = (a, b) => {
    if (a.order || b.order) { // sort by order
      const aOrder = a.order || Infinity
      const bOrder = b.order || Infinity
      return aOrder - bOrder
    } else { // sort by label
      const aLabel = (a.label.toString() || '').toLowerCase()
      const bLabel = (b.label.toString() || '').toLowerCase()

      if (aLabel < bLabel) {
        return -1
      } else if (aLabel > bLabel) {
        return 1
      } else {
        return 0
      }
    }
  }

  highlightSearchQueryInText = (text, searchQuery) => {
    const lowercaseTrimmedText = text.toString().replace(/\s\s+/g, ' ').trim().toLowerCase()

    return lowercaseTrimmedText
      .split(searchQuery.toLowerCase() || undefined) // split by filter
      .reduce((acc, item, index, arr) => [ ...acc, item, index <= arr.length - 2 && searchQuery.length && searchQuery ], [])
      .filter(o => o !== false)
      .reduce((acc, item, index) => [ ...acc, (acc[index - 1] || 0) + item.length ], [])
      .map((length, index, arr) => String(text).substring(arr[index - 1] || 0, length))
      .map((part, index) => (index % 2 === 0 ? <span>{part}</span> : <b>{part}</b>))
  }

  mapContentToList = (item, index) => {
    const { onChange, searchQuery } = this.props
    const onClick = () => {
      item.onClick && item.onClick()
      onChange && onChange(item.label) // for form
      this.hide()
    }

    const lowercaseTrimmedLabel = item.label.toString().replace(/\s\s+/g, ' ').trim().toLowerCase()
    const lowercaseEmailLabel = item.email.toString().replace(/\s\s+/g, ' ').trim().toLowerCase()
    const lowercasePhone = item.phone.toString().replace(/\s\s+/g, ' ').trim().toLowerCase()

    const searchQueryHit = () => {
      return lowercaseTrimmedLabel.includes(searchQuery.toLowerCase()) ||
        lowercaseEmailLabel.includes(searchQuery.toLowerCase()) ||
        lowercasePhone.includes(searchQuery.toLowerCase())
    }

    const show = searchQuery === '' ? true : searchQueryHit()

    return {
      ...item,
      render: (
        <li
          key={index}
          className={`${index === this.state.selected && styles.selected} ${!show && styles.displayNone}`}
          onMouseDown={onClick}
        >
          <div>
            <label className={styles.contactLabel}>
              {this.highlightSearchQueryInText(
                item.representer ? item.representer(item.label) : item.label,
                searchQuery
              )
              }
            </label>
            <div className={styles.contactInfo}>
              {item.email &&
                <div className={styles.contactInfoColumn}>
                  @ {this.highlightSearchQueryInText(item.email, searchQuery)}
                </div>
              }
              {item.phone &&
                <div className={styles.contactInfoColumn}>
                  <i className="fa fa-mobile" aria-hidden="true" /> {this.highlightSearchQueryInText(
                                                                      item.phone,
                                                                      searchQuery
                                                                    )}
                </div>
              }
            </div>
          </div>
        </li>)
    }
  }

  render() {
    const {
      dropdownContent,
      buttons,
      placeholder,
      searchQuery,
      onChange,
      highlight,
      separateFirst
    } = this.props

    let list = dropdownContent.map(this.mapContentToList).sort(this.sorter)

    list = list.map(o => o.render)

    const showFirst = !list[0].props.className.includes('displayNone') && separateFirst

    list = list.filter(i => !i.props.className.includes('displayNone'))
    const showList = list.length > 0 && !(showFirst && list.length === 1)
    return (
      <div className={styles.searchField}>
        <Input
          onChange={onChange}
          value={searchQuery}
          label={placeholder}
          placeholder={placeholder}
          type="text"
          align="left"
          onFocus={this.show}
          onBlur={this.hide}
          ref={component => this.filter = component}
          highlight={highlight}
          style={inputStyles}
        />

        {this.state.show &&
          <div>
            {showFirst &&
              <ul className={styles.separated}>
                {list.shift()}
              </ul>
            }
            <div className={`${styles.drop}`} ref={ul => this.ul = ul}>
              {showList &&
                <ul className={styles.scrollable}>
                  {list}
                </ul>
              }

              <table className={styles.buttons}>
                <tbody>
                  {buttons.map(this.generateButtons)}
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    )
  }
}

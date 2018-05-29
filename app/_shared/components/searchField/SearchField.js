import React, { Component, PropTypes } from 'react'

import CallToActionButton from '../buttons/CallToActionButton'
import Input              from '../input/Input'

import styles from './SearchField.scss'


export default class SearchField extends Component {
  static propTypes = {
    dropdownContent: PropTypes.array.isRequired,
    searchQuery:     PropTypes.string,
    selected:        PropTypes.number,
    onChange:        PropTypes.func,
    buttons:         PropTypes.array,
    placeholder:     PropTypes.string
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
    this.setState({
      ...this.state,
      selected: nextProps.dropdownContent.length === 1 ? nextProps.selected : 0
    })
  }

  hide = () => setTimeout(
    () => this.setState({
      ...this.state,
      show: false
    }),
    100
  )

  show = () => {
    if (this.props.dropdownContent.length > 1) {
      this.setState({
        ...this.state,
        show: true
      })
    }
  }

  generateButtons = item => (
    <tr>
      <td><CallToActionButton label={item.label} onClick={item.onClick} /></td>
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

  render() {
    const { dropdownContent, buttons, placeholder, searchQuery, onChange } = this.props

    let list = dropdownContent.sort(this.sorter).map((item, index) => {
      const onClick = () => {
        item.onClick && item.onClick()
        onChange && onChange(item.label) // for form
        this.hide()
      }
      const lowercaseTrimmedLabel = item.label.toString().replace(/\s\s+/g, ' ').trim().toLowerCase()
      const show = searchQuery === '' ? true : lowercaseTrimmedLabel.includes(searchQuery.toLowerCase())

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
                {item.representer ? item.representer(item.label) : lowercaseTrimmedLabel
                  .split(searchQuery.toLowerCase() || undefined) // split by filter
                  .reduce((acc, item, index, arr) => [ ...acc, item, index <= arr.length - 2 && searchQuery.length && searchQuery ], [])
                  .filter(o => o !== false)
                  .reduce((acc, item, index) => [ ...acc, (acc[index - 1] || 0) + item.length ], [])
                  .map((length, index, arr) => String(item.label).substring(arr[index - 1] || 0, length))
                  .map((part, index) => (index % 2 === 0 ? <span>{part}</span> : <b>{part}</b>))
                }
              </label>
              <div className={styles.contactInfo}>
                {item.email &&
                  <div className={styles.contactInfoColumn}>
                    {`@ ${item.email}`}
                  </div>
                }
                {item.phone &&
                  <div className={styles.contactInfoColumn}>
                    <i className="fa fa-mobile" aria-hidden="true" /> {item.phone}
                  </div>
                }
              </div>
            </div>
          </li>)
      }
    })


    list = list.map(o => o.render)

    return (
      <div>
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
        />

        {this.state.show &&
          <div className={`${styles.drop}`} ref={ul => this.ul = ul}>
            <ul className={styles.scrollable}>
              {list}
            </ul>

            <table className={styles.buttons}>
              <tbody>
                {buttons.map(this.generateButtons)}
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }
}

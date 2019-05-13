import PropTypes from 'prop-types'
import React, { Component } from 'react'

import PopupDatepicker from '../datepicker/PopupDatepicker'

import styles from './Table.scss'


export default class SearchBox extends Component {
  static propTypes = {
    value:    PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type:     PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.input = React.createRef()
    this.state = { showDateSelector: false }
  }


  onInputChange = event => {
    this.props.onChange(event.target.value)
  }

  setEmpty = () => {
    this.props.onChange('')
  }

  showDatePicker = () => {
    this.setState({
      ...this.state,
      showDateSelector: true
    })
  }

  hideDatePicker = () => {
    this.setState({
      ...this.state,
      showDateSelector: false
    })
  }

  focusInput = () => {
    this.input.focus()
  }


  render() {
    const { value, onChange, type } = this.props
    const { showDateSelector } = this.state

    return (
      <span>
        <input
          type="search"
          value={value}
          onChange={this.onInputChange}
          placeholder="------------------------------------------------"
          ref={this.input}
          key="SearchBoxInput"
        />

        {type === 'date' && [
          <i
            className={`fa fa-calendar ${styles.callendar}`}
            aria-hidden="true"
            onClick={this.showDatePicker}
            key="CalendarIcon"
          />,
          <PopupDatepicker
            onSelect={onChange}
            show={showDateSelector}
            flip
            okClick={this.hideDatePicker}
            date={value}
            key="DatePicker"
          />
        ]}

        {value
          ? (
            <i
              className="fa fa-times"
              aria-hidden="true"
              onClick={this.setEmpty}
              key="TimesIcon"
            />
          )
          : (
            <i
              className="fa fa-search"
              aria-hidden="true"
              onClick={this.focusInput}
              key="SearchIcon"
            />
          )
        }
      </span>
    )
  }
}

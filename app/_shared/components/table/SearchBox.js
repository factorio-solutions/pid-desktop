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

    return (<span>
      <input type="search" value={value} onChange={this.onInputChange} placeholder="------------------------------------------------" ref={input => { this.input = input }} />

      { type === 'date' && [
        <i className={`fa fa-calendar ${styles.callendar}`} aria-hidden="true" onClick={this.showDatePicker} />,
        <PopupDatepicker onSelect={onChange} show={this.state.showDateSelector} flip okClick={this.hideDatePicker} date={value} />
      ]}

      { value ?
        <i className="fa fa-times" aria-hidden="true" onClick={this.setEmpty} /> :
        <i className="fa fa-search" aria-hidden="true" onClick={this.focusInput} />
      }
    </span>)
  }
}

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

import Datepicker from '../datepicker/Datepicker'
import Timepicker from '../timepicker/Timepicker'

import styles     from './Datetimepicker.scss'


export default class Datetimepicker extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    datetime: PropTypes.string // moment compatible format
  }

  constructor(props) {
    super(props)
    this.state = { datetime: this.props.datetime ? moment(this.props.datetime) : moment() }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ datetime: nextProps.datetime ? moment(nextProps.datetime) : moment() })
  }

  render() {
    const { onSelect } = this.props

    const onDaySelect = day => {
      const datetime = moment(day + ' ' + this.state.datetime.format('HH:mm'))
      onSelect(datetime.format('YYYY-MM-DD HH:mm'))
      this.setState(
        { datetime: moment(day + ' ' + this.state.datetime.format('HH:mm')) }
      )
    }

    const onTimeSelect = time => {
      const datetime = moment(this.state.datetime.format('YYYY-MM-DD') + ' ' + time)
      onSelect(datetime.format('YYYY-MM-DD HH:mm'))
      this.setState(
        { datetime: moment(this.state.datetime.format('YYYY-MM-DD') + ' ' + time) }
      )
    }

    return (
      <div className={styles.datetimeContainer}>
        <div className={styles.datePicker}>
          <Datepicker onSelect={onDaySelect} date={this.state.datetime.format('YYYY-MM-DD')} />
        </div>
        <div className={styles.timePicker}>
          <Timepicker onSelect={onTimeSelect} time={this.state.datetime.format('HH:mm')} />
        </div>
      </div>
    )
  }
}

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment                           from 'moment'
import { t }                            from '../../modules/localization/localization'

import Month    from './Month'
import Days     from './Days'

import styles   from './Datepicker.scss'


export default class Datepicker extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    date:     PropTypes.string, // moment js compatible format
    showInf:  PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: this.props.date ? moment(this.props.date) : moment(), // selected date
      view:     this.props.date ? moment(this.props.date) : moment() // current month in view
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selected: nextProps.date ? moment(nextProps.date) : moment(),
      view:     nextProps.date ? moment(nextProps.date) : moment()
    })
  }

  onDayClick = day => {
    const { onSelect } = this.props
    this.setState({ ...this.state, selected: moment(day) })
    onSelect(day)
  }

  decreaseMonth = () => {
    this.setState({ ...this.state, view: moment(this.state.view).subtract(1, 'month') })
  }

  increaseMonth = () => {
    this.setState({ ...this.state, view: moment(this.state.view).add(1, 'month') })
  }

  todayClick = () => {
    const { onSelect } = this.props
    onSelect(moment().format('YYYY-MM-DD'))
    this.setState({ selected: moment(), view: moment() })
  }

  infClick = () => {
    const { onSelect } = this.props
    onSelect('')
    this.setState({ selected: '', view: moment() })
  }


  render() {
    const { showInf } = this.props

    return (
      <div className={styles.datepickerContainer}>
        <Month
          date={this.state.view}
          leftClick={this.decreaseMonth}
          rightClick={this.increaseMonth}
        />
        <Days
          month={this.state.view}
          selected={this.state.selected}
          onClick={this.onDayClick}
        />
        <div className={styles.buttonContainer}>
          <span
            role="button"
            onClick={this.todayClick}
          >
            {t([ 'datetimepicker', 'today' ])}
          </span>
          {showInf &&
            <span
              role="button"
              tabIndex={0}
              onClick={this.infClick}
            >
              {t([ 'datetimepicker', 'inf' ])}
            </span>
          }
        </div>
      </div>
    )
  }
}

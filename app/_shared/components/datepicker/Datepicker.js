import React, { Component, PropTypes }  from 'react'
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

  render() {
    const { onSelect, showInf } = this.props

    const decreaseMonth = () => {
      this.setState({ ...this.state, view: moment(this.state.view).subtract(1, 'month') })
    }

    const increaseMonth = () => {
      this.setState({ ...this.state, view: moment(this.state.view).add(1, 'month') })
    }

    const onDayClick = day => {
      this.setState({ ...this.state, selected: moment(day) })
      onSelect(day)
    }

    const todayClick = () => {
      onSelect(moment().format('YYYY-MM-DD'))
      this.setState({ selected: moment(), view: moment() })
    }

    const infClick = () => {
      onSelect('')
      this.setState({ selected: '', view: moment() })
    }

    return (
      <div className={styles.datepickerContainer}>
        <Month date={this.state.view} leftClick={decreaseMonth} rightClick={increaseMonth} />
        <Days month={this.state.view} selected={this.state.selected} onClick={onDayClick} />
        <div className={styles.buttonContainer}>
          <span onClick={todayClick}>{t([ 'datetimepicker', 'today' ])}</span>
          {showInf && <span onClick={infClick}>{t([ 'datetimepicker', 'inf' ])}</span>}
        </div>
      </div>
    )
  }
}

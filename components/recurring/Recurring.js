import React, { Component, PropTypes } from 'react'
import moment                          from 'moment'

import Modal     from '../modal/Modal'
import Dropdown  from '../dropdown/Dropdown'
import Form      from '../form/Form'
import DateInput from '../input/DateInput'
import Input     from '../input/Input'

import { t }                              from '../../modules/localization/localization'
import { formatDate, MOMENT_DATE_FORMAT } from '../../helpers/time'

import styles from './Recurring.scss'


const REPEAT_TYPES = [ 'day', 'week', 'month' ]
const REPEAT_INTERVALS = Array.from(Array(30).keys()).map(i => i + 1)
const REPEAT_MAX_COUNT = 100
const REPEAT_DEFAULT_STATE = {
  type:     'week',
  interval: 1,
  day:      [ moment().weekday() ],
  starts:   formatDate(moment()),
  count:    10
}


export default class Recurring extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired, // will return rule as string or undefined
    show:     PropTypes.bool.isRequired,
    rule:     PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]) // start value
  }

  static defaultProps = {
    rule: JSON.stringify(REPEAT_DEFAULT_STATE)
  }

  constructor(props) {
    super(props)
    this.state = props.rule ? this.parseRule(props.rule) : REPEAT_DEFAULT_STATE
  }

  parseRule(rule) {
    try {
      return typeof rule === 'string' ? JSON.parse(rule) : rule
    } catch (e) {
      return REPEAT_DEFAULT_STATE
    }
  }

  createRule() {
    return JSON.stringify(this.state)
  }

  render() {
    const { onSubmit, show } = this.props

    const submit = () => onSubmit(this.createRule())

    const toTypely = type => type === 'day' ? 'daily' : type + 'ly'

    const toTypeDropdown = type => ({
      label:   t([ 'recurringReservation', toTypely(type) ]),
      onClick: () => this.setState({ ...this.state, type })
    })

    const toIntervalDropdown = interval => ({
      label:   interval,
      onClick: () => this.setState({ ...this.state, interval })
    })

    const toCheckbox = day => {
      const indexOf = this.state.day.indexOf(day.index)
      const onClick = () => this.setState({
        ...this.state,
        day: indexOf > -1 ?
          [ ...this.state.day.slice(0, indexOf), ...this.state.day.slice(indexOf + 1) ] :
          [ ...this.state.day, day.index ].sort((a, b) => a > b)
      })
      return <span className={styles.day}><input type="checkbox" checked={indexOf > -1} onChange={onClick} />{day.name}</span>
    }

    const createDayNames = (d, index) => {
      const day = moment([ '2015', '07', 13 + index ].join('-'))
      return {
        name:  day.format('dd'),
        index: day.weekday()
      }
    }


    const firstOccurence = moment(this.state.starts, MOMENT_DATE_FORMAT) // true first occurence
    if (this.state.type === 'week') {
      const firstWeekday = this.state.day.find(weekday => weekday >= moment(this.state.starts, MOMENT_DATE_FORMAT).weekday())
      const startingWeekday = this.state.day.length ?
      firstWeekday === undefined ? this.state.day[0] : firstWeekday :
      moment().weekday()
      firstOccurence.weekday(startingWeekday < moment(this.state.starts, MOMENT_DATE_FORMAT).weekday() ? startingWeekday + 7 : startingWeekday)
    }

    const calculateCount = date => {
      const count = Math.floor(
        ((moment(date, MOMENT_DATE_FORMAT).diff(moment(firstOccurence, MOMENT_DATE_FORMAT, true), this.state.type) / this.state.interval) + 1) *
        ((this.state.type === 'week' && this.state.day.length) || 1)
      )
      this.setState({ ...this.state, count: count <= 0 ? 1 : count })
    }

    const endsOnValue = () => {
      const occurencesThisInterval = this.state.type === 'week' ? this.state.day.filter(day => day >= firstOccurence.weekday()).filter((d, i) => i < this.state.count).length || 1 : 1
      const occurencesLastInterval = this.state.type === 'week' ? (this.state.count - occurencesThisInterval < 0 ? 0 : this.state.count - occurencesThisInterval) % (this.state.day.length || 1) : 0
      if (this.state.type === 'week') {
        const startCorrection = this.state.day[(this.state.count < this.state.day.length ? this.state.count : this.state.day.length) - 1]
        firstOccurence.weekday(startCorrection + ((startCorrection < moment(this.state.starts, MOMENT_DATE_FORMAT).weekday() ? 7 : 0) * (this.state.interval - 1)))
      }
      console.log(formatDate(firstOccurence), occurencesThisInterval, occurencesLastInterval)
      const add = ((this.state.count - occurencesThisInterval - occurencesLastInterval) / ((this.state.type === 'week' && this.state.day.length) || 1)) * this.state.interval
      const lastOccurence = firstOccurence.clone().add(add, this.state.type)
      if (this.state.type === 'week' && occurencesLastInterval > 0) {
        const endCorrection = this.state.day[occurencesLastInterval - 1]
        console.log(formatDate(lastOccurence), endCorrection);
        occurencesLastInterval && lastOccurence.add(this.state.interval - 1, this.state.type)
        console.log(formatDate(lastOccurence), 'actually added', endCorrection <= moment(this.state.starts, MOMENT_DATE_FORMAT).weekday() ? endCorrection + 7 : endCorrection);
        lastOccurence.weekday(endCorrection <= lastOccurence.weekday() ? endCorrection + 7 : endCorrection)
        console.log(formatDate(lastOccurence));
      }

      return formatDate(lastOccurence) // also calculate date value from count
    }


    return (
      <Modal show={show}>
        <Form onSubmit={submit} onBack={onSubmit} submitable margin={false} >
          <h2>{t([ 'recurringReservation', 'repeat' ])}</h2>
          <table className={styles.recurring}>
            <tbody>
              <tr>
                <td>{t([ 'recurringReservation', 'repeats' ])}</td>
                <td>
                  <Dropdown content={REPEAT_TYPES.map(toTypeDropdown)} selected={REPEAT_TYPES.indexOf(this.state.type)} style="light" />
                </td>
              </tr>
              <tr>
                <td>{t([ 'recurringReservation', 'repeatEvery' ])}</td>
                <td className={styles.setLineHeight}>
                  <Dropdown content={REPEAT_INTERVALS.map(toIntervalDropdown)} selected={REPEAT_INTERVALS.indexOf(this.state.interval)} style="light" />
                  <span>{t([ 'recurringReservation', this.state.type ], { count: this.state.interval })}</span>
                </td>
              </tr>
              {this.state.type === 'week' && <tr>
                <td>{t([ 'recurringReservation', 'repeatOn' ])}</td>
                <td>
                  {Array(...{ length: 7 }).map(createDayNames).map(toCheckbox)}
                </td>
              </tr>}
              <tr>
                <td>{t([ 'recurringReservation', 'startsOn' ])}</td>
                <td className={styles.setLineHeight}>
                  {this.state.starts}
                  {/* <DateInput onChange={startsSelected} value={this.state.starts} style={styles.dateSelector} /> */}
                </td>
              </tr>
              <tr>
                <td>{t([ 'recurringReservation', 'ends' ])}</td>
                <td className={styles.setLineHeight}>
                  <span>{t([ 'recurringReservation', 'after' ])}</span>
                  <Input
                    style={styles.countSelector}
                    value={this.state.count}
                    type="number"
                    min={1}
                    step={1}
                    onChange={val => this.setState({ ...this.state, count: val > REPEAT_MAX_COUNT ? REPEAT_MAX_COUNT : val < 1 ? 1 : parseInt(val, 10) })}
                  />
                  <span>{t([ 'recurringReservation', 'occurence' ], { count: this.state.count })}</span>
                </td>
              </tr>
              <tr>
                <td />
                <td className={styles.setLineHeight}>
                  <span>{t([ 'recurringReservation', 'on' ])}</span>
                  <DateInput onChange={calculateCount} value={endsOnValue()} style={styles.dateSelector} />
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </Modal>
    )
  }
}

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

import Modal     from '../modal/Modal'
import Dropdown  from '../dropdown/Dropdown'
import Form      from '../form/Form'
import DateInput from '../input/DateInput'
import Input     from '../input/Input'

import { t }                              from '../../modules/localization/localization'
import {
  formatDate,
  MOMENT_DATE_FORMAT
} from '../../helpers/time'

import styles from './Recurring.scss'


const REPEAT_TYPES = [ 'day', 'week', 'month' ]
const REPEAT_INTERVALS = Array.from(Array(30).keys()).map(i => i + 1)
const REPEAT_MAX_COUNT = 100


export default class Recurring extends Component {
  static propTypes = {
    onSubmit:  PropTypes.func.isRequired, // will return rule as string or undefined
    show:      PropTypes.bool.isRequired,
    showDays:  PropTypes.bool,
    showWeeks: PropTypes.bool,
    rule:      PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]), // start value
    preferedFrom: PropTypes.object
  }

  static defaultProps = {
    showDays:  true,
    showWeeks: true
  }

  constructor(props) {
    super(props)
    const from = props.preferedFrom || moment()
    this.state = {
      type:     'week',
      interval: 1,
      day:      [ from.weekday() ],
      starts:   formatDate(from),
      count:    10,
      ...props.rule
    }
  }

  componentDidMount() {
    this.checkProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.checkProps(nextProps)
  }

  toTypely = type => type === 'day' ? 'daily' : type + 'ly'

  toTypeDropdown = (type, index) => ({
    label:   t([ 'recurringReservation', this.toTypely(type) ]),
    order:   index + 1,
    onClick: () => this.setState(state => ({ ...state, type }))
  })

  toIntervalDropdown = interval => ({
    label:   interval,
    order:   interval,
    onClick: () => this.setState(state => ({ ...state, interval }))
  })

  toCheckbox = day => {
    const { day: stateDay } = this.state
    const indexOf = stateDay.indexOf(day.index)
    const onClick = () => this.setState(state => ({
      ...state,
      day: indexOf > -1
        ? [ ...state.day.slice(0, indexOf), ...state.day.slice(indexOf + 1) ]
        : [ ...state.day, day.index ].sort((a, b) => a > b)
    }))
    return (
      <span className={styles.day}>
        <input type="checkbox" checked={indexOf > -1} onChange={onClick} />
        {day.name}
      </span>
    )
  }

  calculateFirstOccurence = state => {
    const { starts, type, day } = state
    // true first occurence given selected days
    const firstOccurence = moment(starts, MOMENT_DATE_FORMAT)
    if (type === 'week') {
      const firstWeekday = day.find(
        weekday => weekday >= moment(starts, MOMENT_DATE_FORMAT).weekday()
      )
      const startingWeekday = day.length
        ? firstWeekday === undefined
          ? day[0]
          : firstWeekday
        : moment(starts, MOMENT_DATE_FORMAT).weekday()
      firstOccurence
        .weekday(
          startingWeekday < moment(starts, MOMENT_DATE_FORMAT).weekday()
            ? startingWeekday + 7
            : startingWeekday
        )
    }
    return firstOccurence
  }

  endsOnValue = () => {
    const { day, count, type, starts, interval } = this.state
    const firstOccurence = this.calculateFirstOccurence(this.state)

    const occurencesThisInterval = type === 'week'
      ? day.filter(d => d >= firstOccurence.weekday()).filter((d, i) => i < count).length || 1
      : 1
    const occurencesLastInterval = type === 'week'
      ? (count - occurencesThisInterval < 0
        ? 0
        : count - occurencesThisInterval) % (day.length || 1)
      : 0
    if (type === 'week') {
      const startCorrection = count >= day.length
        ? day[day.length - 1]
        : day.filter(d => d >= firstOccurence.weekday())[count - 1]
      firstOccurence
        .weekday(
          startCorrection + (
            (startCorrection < moment(starts, MOMENT_DATE_FORMAT).weekday()
              ? 7
              : 0)
            * (interval - 1)
          )
        )
    }
    const add = (
      (count - occurencesThisInterval - occurencesLastInterval)
      / ((type === 'week' && day.length) || 1)
    ) * interval
    const lastOccurence = firstOccurence.clone().add(add, type)
    if (type === 'week' && occurencesLastInterval > 0) {
      const endCorrection = day[occurencesLastInterval - 1]
      occurencesLastInterval && lastOccurence.add(interval - 1, type)
      lastOccurence
        .weekday(
          endCorrection <= lastOccurence.weekday()
            ? endCorrection + 7
            : endCorrection
        )
    }

    // also calculate date value from count
    return formatDate(lastOccurence)
  }

  calculateCount = date => {
    const { day, type, starts, interval } = this.state
    const firstOccurence = this.calculateFirstOccurence(this.state)
    const lastOccurence = moment(date, MOMENT_DATE_FORMAT)
    if (type === 'week') {
      const lastWeekday = day
        .slice()
        .reverse()
        .find(d => d <= moment(date, MOMENT_DATE_FORMAT).weekday())

      const intervalCorrection = lastOccurence
        .clone()
        .startOf('week')
        .diff(firstOccurence.clone().startOf('week'), 'week')
        % interval
      const endingWeekday = intervalCorrection
        ? day[day.length - 1]
        : day.length
          ? lastWeekday === undefined
            ? day[day.length - 1]
            : lastWeekday
          : moment(starts, MOMENT_DATE_FORMAT).weekday()

      lastOccurence
        .weekday(
          endingWeekday > moment(date, MOMENT_DATE_FORMAT).weekday()
            ? endingWeekday - 7
            : endingWeekday
        )
        .subtract(
          lastOccurence
            .clone()
            .startOf('week')
            .diff(firstOccurence.clone().startOf('week'), 'week')
            % interval
          , 'weeks'
        )
    }

    let count = (
      Math.floor(
        (lastOccurence.diff(firstOccurence, type, true) / interval)
      )
      * ((type === 'week' && day.length) || 1)
    )

    if (type === 'week') {
      const correction = (firstOccurence.weekday() <= lastOccurence.weekday())
        ? day.filter(d => firstOccurence.weekday() <= d && d <= lastOccurence.weekday()).length
        : day.filter(d => firstOccurence.weekday() >= d || d >= lastOccurence.weekday()).length

      count += correction - 1
    }

    this.setState(state => ({
      ...state,
      count: count <= 0
        ? 1
        : count >= REPEAT_MAX_COUNT
          ? 100
          : count + 1
    }))
  }

  submit = () => {
    const { day } = this.state
    const { onSubmit } = this.props
    const newStarts = this.calculateFirstOccurence(this.state).format(MOMENT_DATE_FORMAT)
    // offset it to endglish notation due to english server
    const dayCorrection = moment.localeData().firstDayOfWeek()
    onSubmit({
      ...this.state,
      starts: newStarts,
      day:    day.map(d => d + dayCorrection)
    })
    this.setState(state => ({ ...state, starts: newStarts }))
  }

  createDayNames = (d, index) => {
    const day = moment().weekday(index)
    return {
      name:  day.format('dd'),
      index: day.weekday()
    }
  }

  checkProps(props) {
    let newState = this.state
    const { starts, type, day } = this.state
    const { preferedFrom, rule } = this.props

    if (!rule && preferedFrom !== props.preferedFrom) {
      newState = {
        ...newState,
        starts: formatDate(props.preferedFrom),
        day:    [ props.preferedFrom.weekday() ]
      }
    }

    if (props.rule && props.rule.starts !== starts) {
      newState = {
        ...newState,
        starts: props.rule.starts,
        day:    [ moment(props.rule.starts, MOMENT_DATE_FORMAT).weekday() ]
      }
    }
    if (props.showDays && (type === 'day' || (type === 'week' && day.length > 1))) {
      newState = {
        ...newState,
        type: 'week',
        day:  [ moment(starts, MOMENT_DATE_FORMAT).weekday() ]
      }
    }
    if (!props.showWeeks && type === 'week') {
      newState = {
        ...newState,
        type: 'month',
        day:  [ moment(starts, MOMENT_DATE_FORMAT).weekday() ]
      }
    }
    if (this.state !== newState) {
      this.setState(newState)
    }
  }

  render() {
    const { onSubmit, show, showDays, showWeeks } = this.props
    const { type, interval, count } = this.state

    const filterDays = scale => showDays ? true : scale !== 'day'

    const filterWeeks = scale => showWeeks ? true : scale !== 'week'

    const filteredTypes = REPEAT_TYPES.filter(filterDays).filter(filterWeeks)

    return (
      <Modal show={show}>
        <Form onSubmit={this.submit} onBack={onSubmit} submitable margin={false} modal>
          <h2>{t([ 'recurringReservation', 'repeatTitle' ])}</h2>
          <table className={styles.recurring}>
            <tbody>
              <tr>
                <td>{t([ 'recurringReservation', 'repeats' ])}</td>
                <td>
                  <Dropdown
                    content={filteredTypes.map(this.toTypeDropdown)}
                    selected={filteredTypes.indexOf(type)}
                    style="light"
                  />
                </td>
              </tr>
              <tr>
                <td>{t([ 'recurringReservation', 'repeatEvery' ])}</td>
                <td className={styles.setLineHeight}>
                  <Dropdown
                    content={REPEAT_INTERVALS.map(this.toIntervalDropdown)}
                    selected={REPEAT_INTERVALS.indexOf(interval)}
                    style="light"
                  />
                  <span>
                    {t([ 'recurringReservation', type ], { count: interval })}
                  </span>
                </td>
              </tr>
              {type === 'week' && showDays && (
                <tr>
                  <td>{t([ 'recurringReservation', 'repeatOn' ])}</td>
                  <td>
                    {Array(...{ length: 7 }).map(this.createDayNames).map(this.toCheckbox)}
                  </td>
                </tr>
              )}
              <tr>
                <td>{t([ 'recurringReservation', 'startsOn' ])}</td>
                <td className={styles.setLineHeight}>
                  {this.calculateFirstOccurence(this.state).format(MOMENT_DATE_FORMAT)}
                </td>
              </tr>
              <tr>
                <td>{t([ 'recurringReservation', 'ends' ])}</td>
                <td className={styles.setLineHeight}>
                  <span>{t([ 'recurringReservation', 'after' ])}</span>
                  <Input
                    style={styles.countSelector}
                    value={count}
                    type="number"
                    min={1}
                    step={1}
                    onChange={val => this.setState(state => ({
                      ...state,
                      count: val > REPEAT_MAX_COUNT
                        ? REPEAT_MAX_COUNT
                        : val < 1
                          ? 1
                          : parseInt(val, 10)
                    }))}
                  />
                  <span>
                    {t([ 'recurringReservation', 'occurence' ], { count })}
                  </span>
                </td>
              </tr>
              <tr>
                <td />
                <td className={styles.setLineHeight}>
                  <span>{t([ 'recurringReservation', 'on' ])}</span>
                  <DateInput
                    onChange={this.calculateCount}
                    value={this.endsOnValue()}
                    style={styles.dateSelector}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </Modal>
    )
  }
}

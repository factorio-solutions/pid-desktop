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


export default class Recurring extends Component {
  static propTypes = {
    onSubmit:  PropTypes.func.isRequired, // will return rule as string or undefined
    show:      PropTypes.bool.isRequired,
    showDays:  PropTypes.bool,
    showWeeks: PropTypes.bool,
    rule:      PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]) // start value
  }

  static defaultProps = {
    showDays:  true,
    showWeeks: true
  }

  constructor(props) {
    super(props)
    this.state = {
      type:     'week',
      interval: 1,
      day:      [ moment().weekday() ],
      starts:   formatDate(moment()),
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

  checkProps(props) {
    const onStateChange = () => props.onSubmit(this.state)
    let newState = this.state

    if (props.rule && props.rule.starts !== this.state.starts) {
      newState = { ...newState, starts: props.rule.starts, day: [ moment(props.rule.starts, MOMENT_DATE_FORMAT).weekday() ] }
      // this.setState({ ...this.state, starts: props.rule.starts, day: [ moment(props.rule.starts, MOMENT_DATE_FORMAT).weekday() ] }, onStateChange)
    }
    if (props.showDays && (this.state.type === 'day' || (this.state.type === 'week' && this.state.day.length > 1))) {
      newState = { ...newState, type: 'week', day: [ moment(this.state.starts, MOMENT_DATE_FORMAT).weekday() ] }
      // this.setState({ ...this.state, type: 'week', day: [ moment(this.state.starts, MOMENT_DATE_FORMAT).weekday() ] }, onStateChange)
    }
    if (!props.showWeeks && this.state.type === 'week') {
      newState = { ...newState, type: 'month', day: [ moment(this.state.starts, MOMENT_DATE_FORMAT).weekday() ] }
      // this.setState({ ...this.state, type: 'month', day: [ moment(this.state.starts, MOMENT_DATE_FORMAT).weekday() ] }, onStateChange)
    }
    if ((props.rule && props.rule.starts !== this.state.starts) ||
    (props.showDays && (this.state.type === 'day' || (this.state.type === 'week' && this.state.day.length > 1))) ||
    (!props.showWeeks && this.state.type === 'week')) {
      this.setState(newState) //, onStateChange
    }
  }

  render() {
    const { onSubmit, show, showDays, showWeeks } = this.props

    const filterDays = type => showDays ? true : type !== 'day'
    const filterWeeks = type => showWeeks ? true : type !== 'week'
    const toTypely = type => type === 'day' ? 'daily' : type + 'ly'

    const toTypeDropdown = type => ({
      label:   t([ 'recurringReservation', toTypely(type) ]),
      onClick: () => this.setState({ ...this.state, type })
    })

    const filteredTypes = REPEAT_TYPES.filter(filterDays).filter(filterWeeks)

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
      const day = moment().weekday(index)
      return {
        name:  day.format('dd'),
        index: day.weekday()
      }
    }

    const calculateFirstOccurence = state => {
      const firstOccurence = moment(state.starts, MOMENT_DATE_FORMAT) // true first occurence given selected days
      if (state.type === 'week') {
        const firstWeekday = state.day.find(weekday => weekday >= moment(state.starts, MOMENT_DATE_FORMAT).weekday())
        const startingWeekday = state.day.length ?
        firstWeekday === undefined ? state.day[0] : firstWeekday :
        moment(this.state.starts, MOMENT_DATE_FORMAT).weekday()
        firstOccurence.weekday(startingWeekday < moment(state.starts, MOMENT_DATE_FORMAT).weekday() ? startingWeekday + 7 : startingWeekday)
      }
      return firstOccurence
    }

    const calculateCount = date => {
      const firstOccurence = calculateFirstOccurence(this.state)
      const lastOccurence = moment(date, MOMENT_DATE_FORMAT)
      if (this.state.type === 'week') {
        const lastWeekday = this.state.day.slice().reverse().find(day => day <= moment(date, MOMENT_DATE_FORMAT).weekday())
        const intervalCorrection = lastOccurence.clone().startOf('week').diff(firstOccurence.clone().startOf('week'), 'week') % this.state.interval
        const endingWeekday = intervalCorrection ?
          this.state.day[this.state.day.length - 1] :
          this.state.day.length ?
            lastWeekday === undefined ?
              this.state.day[this.state.day.length - 1] :
              lastWeekday :
              moment(this.state.starts, MOMENT_DATE_FORMAT).weekday()

        lastOccurence.weekday(endingWeekday > moment(date, MOMENT_DATE_FORMAT).weekday() ? endingWeekday - 7 : endingWeekday)
          .subtract(lastOccurence.clone().startOf('week').diff(firstOccurence.clone().startOf('week'), 'week') % this.state.interval, 'weeks')
      }

      let count = Math.floor((lastOccurence.diff(firstOccurence, this.state.type, true) / this.state.interval)) * ((this.state.type === 'week' && this.state.day.length) || 1)

      if (this.state.type === 'week') {
        const correction = (firstOccurence.weekday() <= lastOccurence.weekday()) ?
          this.state.day.filter(day => firstOccurence.weekday() <= day && day <= lastOccurence.weekday()).length :
          this.state.day.filter(day => firstOccurence.weekday() >= day || day >= lastOccurence.weekday()).length

        count += correction - 1
      }

      this.setState({ ...this.state, count: count <= 0 ? 1 : count >= REPEAT_MAX_COUNT ? 100 : count + 1 })
    }

    const endsOnValue = () => {
      const firstOccurence = calculateFirstOccurence(this.state)

      const occurencesThisInterval = this.state.type === 'week' ? this.state.day.filter(day => day >= firstOccurence.weekday()).filter((d, i) => i < this.state.count).length || 1 : 1
      const occurencesLastInterval = this.state.type === 'week' ? (this.state.count - occurencesThisInterval < 0 ? 0 : this.state.count - occurencesThisInterval) % (this.state.day.length || 1) : 0
      if (this.state.type === 'week') {
        const startCorrection = this.state.count >= this.state.day.length ?
          this.state.day[this.state.day.length - 1] :
          this.state.day.filter(day => day >= firstOccurence.weekday())[this.state.count - 1]
        firstOccurence.weekday(startCorrection + ((startCorrection < moment(this.state.starts, MOMENT_DATE_FORMAT).weekday() ? 7 : 0) * (this.state.interval - 1)))
      }
      const add = ((this.state.count - occurencesThisInterval - occurencesLastInterval) / ((this.state.type === 'week' && this.state.day.length) || 1)) * this.state.interval
      const lastOccurence = firstOccurence.clone().add(add, this.state.type)
      if (this.state.type === 'week' && occurencesLastInterval > 0) {
        const endCorrection = this.state.day[occurencesLastInterval - 1]
        occurencesLastInterval && lastOccurence.add(this.state.interval - 1, this.state.type)
        lastOccurence.weekday(endCorrection <= lastOccurence.weekday() ? endCorrection + 7 : endCorrection)
      }

      return formatDate(lastOccurence) // also calculate date value from count
    }

    const submit = () => {
      const newStarts = calculateFirstOccurence(this.state).format(MOMENT_DATE_FORMAT)
      onSubmit({ ...this.state, starts: newStarts })
      this.setState({ ...this.state, starts: newStarts })
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
                  <Dropdown content={filteredTypes.map(toTypeDropdown)} selected={filteredTypes.indexOf(this.state.type)} style="light" />
                </td>
              </tr>
              <tr>
                <td>{t([ 'recurringReservation', 'repeatEvery' ])}</td>
                <td className={styles.setLineHeight}>
                  <Dropdown content={REPEAT_INTERVALS.map(toIntervalDropdown)} selected={REPEAT_INTERVALS.indexOf(this.state.interval)} style="light" />
                  <span>{t([ 'recurringReservation', this.state.type ], { count: this.state.interval })}</span>
                </td>
              </tr>
              {this.state.type === 'week' && showDays && <tr>
                <td>{t([ 'recurringReservation', 'repeatOn' ])}</td>
                <td>
                  {Array(...{ length: 7 }).map(createDayNames).map(toCheckbox)}
                </td>
              </tr>}
              <tr>
                <td>{t([ 'recurringReservation', 'startsOn' ])}</td>
                <td className={styles.setLineHeight}>
                  {calculateFirstOccurence(this.state).format(MOMENT_DATE_FORMAT)}
                  {/*this.state.starts*/}
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

import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { windowLength } from './OccupancyOverview'

import styles from './OccupancyOverview.scss'
import Tooltip from '../tooltip/Tooltip'

import { dateAdd } from '../../helpers/dateHelper'

import {
  floorTime,
  MOMENT_DATETIME_FORMAT
} from '../../helpers/time'

export default class Place extends Component {
  static propTypes = {
    currentUser:             PropTypes.object,
    setNewReservation:       PropTypes.func,
    place:                   PropTypes.object,
    duration:                PropTypes.string,
    from:                    PropTypes.object,
    now:                     PropTypes.number,
    showDetails:             PropTypes.bool,
    onReservationClick:      PropTypes.func,
    renderTextInReservation: PropTypes.bool,
    isIe:                    PropTypes.bool,
    cellSelector:            PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      rendered:  false,
      mouseDown: false,
      left:      0,
      width:     0,
      mouseX:    0,
      mouseY:    0,
      showTime:  false,
      time:      null
    }
    this.mouseIsOverTimeout
  }

  componentDidMount() {
    this.setState(state => ({
      ...state,
      rendered: true
    }))
  }

  formatTimeInTimeTooltip = date => {
    let minutes = Math.floor(date.getMinutes() / 15) * 15
    let hours = date.getHours()
    let day = date.getDate()
    let month = date.getMonth() + 1
    const baseYear = 1900
    const year = date.getYear() + baseYear

    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (hours < 10) {
      hours = '0' + hours
    }
    if (day < 10) {
      day = '0' + day
    }
    if (month < 10) {
      month = '0' + month
    }

    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  calculateTime = (target, position) => {
    const td = target.parentElement.children[1]
    const { from, duration } = this.props
    const dur = windowLength(duration)
    const rowWidth = (
      td.parentElement.getBoundingClientRect().width
      - td.parentElement.children[0].getBoundingClientRect().width
    )
    const reservationStart = (
      (position - td.getBoundingClientRect().left)
      / (rowWidth / dur)
    )
    return dateAdd(from.toDate(), reservationStart * 24, 'hours')
  }

  onTrMouseMove = e => this.setState({
    ...this.state,
    showTime: true,
    time:     (
      this.state.mouseDown
        ? floorTime(this.calculateReservationFromDiv().endsAt).format(MOMENT_DATETIME_FORMAT)
        : this.formatTimeInTimeTooltip(this.calculateTime(e.target, e.clientX))
    ),
    mouseX: e.clientX + 20,
    mouseY: e.clientY
  })

  onTrMouseLeave = () => {
    const { showTime } = this.state
    if (this.mouseIsOverTimeout) {
      clearTimeout(this.mouseIsOverTimeout)
      this.mouseIsOverTimeout = null
    }
    if (showTime) {
      this.setState(state => ({ state, showTime: false }))
    }
  }

  onTrMouseEnter = () => {
    this.mouseIsOverTimeout = setTimeout(() => {
      this.setState(state => ({ state, showTime: true }))
      this.mouseIsOverTimeout = null
    }, 200)
  }

  onMouseDown = event => {
    const { left, mouseDown, width } = this.state
    const newWidth = mouseDown ? width : 0
    const newLeft = mouseDown
      ? left
      : event.clientX - this.td.getBoundingClientRect().left
    document.body.addEventListener('mousemove', this.onMouseMove)
    document.body.addEventListener('mouseup', this.onMouseUp)

    this.setState(state => ({
      ...state,
      mouseDown: true,
      width:     newWidth,
      left:      newLeft
    }))
  }

  onMouseMove = event => {
    const { left, mouseDown } = this.state
    if (mouseDown) {
      const newWidth = event.clientX - this.td.getBoundingClientRect().left - left
      const range = this.calculateReservationFromDiv(undefined, newWidth)
      const reservations = this.reservationsInRange(range.beginsAt, range.endsAt)

      if (!reservations.length) {
        this.setState(state => ({
          ...state,
          width: event.clientX - this.td.getBoundingClientRect().left - state.left
        }))
      }
    }
  }

  onMouseUp = () => {
    const {
      setNewReservation: setNewReservationAction,
      place
    } = this.props

    if (this.newReservationDiv) {
      const range = this.calculateReservationFromDiv()
      const reservations = this.reservationsInRange(range.beginsAt, range.endsAt)

      document.body.removeEventListener('mousemove', this.onMouseMove)
      document.body.removeEventListener('mouseup', this.onMouseUp)

      setNewReservationAction(
        range.beginsAt,
        reservations.length ? reservations[0].begins_at : range.endsAt,
        place.id
      )
    }

    this.setState(state => ({ ...state, mouseDown: false }))
  }

  reservationsInRange = (from, to) => this.props.place.reservations
    .filter(reservation => from.isBefore(reservation.ends_at))
    .filter(reservation => to.isAfter(reservation.begins_at))
    .sort((a, b) => a.begins_at.diff(b.begins_at))

  calculateReservationFromDiv = (left, width) => {
    if (!this.newReservationDiv) {
      return {}
    }

    const { from, duration } = this.props
    const divDimensions = this.newReservationDiv.getBoundingClientRect()
    // in days
    const dur = windowLength(duration)
    const tdDimensions = this.td.getBoundingClientRect()
    const rowWidth = (
      this.row.getBoundingClientRect().width
      - tdDimensions.width
    )

    const pixelsPerDay = rowWidth / dur
    const reservationStart = (
      ((left || divDimensions.left) - tdDimensions.right)
      / pixelsPerDay
    )
    const reservationDuration = (width || divDimensions.width) / pixelsPerDay
    const beginsAt = from.clone().add(reservationStart * 24, 'hours')
    const endsAt = beginsAt.clone().add(reservationDuration * 24, 'hours')

    return { beginsAt, endsAt }
  }

  render() {
    const {
      from,
      duration,
      place,
      now,
      isIe,
      onReservationClick,
      showDetails,
      currentUser,
      renderTextInReservation,
      cellSelector
    } = this.props
    const {
      rendered, mouseDown, left, width, showTime, time, mouseX, mouseY
    } = this.state
    const windowLengthInDay = windowLength(duration) // in days
    const cellCount = windowLengthInDay * (duration === 'day' ? 24 : 2)

    const cellWidth = rendered && place.reservations.length > 0
      ? this.row.childNodes[1].getBoundingClientRect().width
      : 0

    const cellsState = {
      cellCount,
      cellWidth,
      place,
      now,
      from,
      isIe,
      duration,
      renderTextInReservation,
      rendered,
      onReservationClick,
      showDetails,
      currentUser,
      row: this.row
    }

    const style = {
      left:  left + 'px',
      width: width + 'px'
    }

    return (
      <tr
        key={`${place.floor}-${place.label}`}
        className={styles.bottomBorder}
        ref={row => { this.row = row }}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onTrMouseMove}
        onMouseLeave={this.onTrMouseLeave}
        onMouseEnter={this.onTrMouseEnter}
      >
        <td
          className={styles.rightBorder}
          ref={ref => this.td = ref}
        >
          {`${place.floor}/${place.label}`}
          {mouseDown && (
            <div
              className={styles.newReservation}
              style={style}
              ref={div => { this.newReservationDiv = div }}
            />
          )}
          <Tooltip
            content={time}
            mouseX={mouseX}
            mouseY={mouseY}
            visible={showTime}
            height="50px"
            style={{ zIndex: 10 }}
          />
        </td>
        {cellSelector(cellsState)}
      </tr>
    )
  }
}

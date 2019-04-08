import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Reservation from './Reservation'

import { DAY, WEEK_DAYS, MONTH_DAYS } from './OccupancyOverview'
import { getTextWidth14px }           from '../../helpers/estimateTextWidth'
import {
  firstDateIsBefore, diff, firstDateIsBeforeOrEqual, firstDateIsAfter, dateIsInRange, dateAdd
} from '../../helpers/dateHelper'
import { MOMENT_DATETIME_FORMAT } from '../../helpers/time'

import styles from './OccupancyOverview.scss'
import Cell from './cell'


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
    isIe:                    PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      rendered:  false,
      mouseDown: false,
      left:      0,
      width:     0,
      showTime:  false,
      mouseX:    0,
      mouseY:    0
    }
  }

  componentDidMount() {
    this.setState(state => ({
      ...state,
      rendered: true
    }))
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

  onTdMouseMove = e => this.setState({
    ...this.state,
    showTime: true,
    time:     (
      this.state.mouseDown
        ? this.calculateReservationFromDiv().endsAt
        : this.calculateTime(e.target, e.clientX)
    ).format(MOMENT_DATETIME_FORMAT),
    mouseX: e.clientX + 20,
    mouseY: e.clientY
  })

  onTdMouseLeave=() => this.setState(state => ({ state, showTime: false }))

  onTdMouseEnter=() => this.setState(state => ({ state, showTime: true }))

  reservationsInRange = (from, to) => this.props.place.reservations
    .filter(reservation => from.isBefore(reservation.ends_at))
    .filter(reservation => to.isAfter(reservation.begins_at))
    .sort((a, b) => a.begins_at.diff(b.begins_at))

  calculateTime = (target, position) => {
    const td = target.parentElement.children[1]
    const { from, duration } = this.props
    const dur = (duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS)
    const rowWidth = (
      td.parentElement.getBoundingClientRect().width
      - td.parentElement.children[0].getBoundingClientRect().width
    )
    const reservationStart = (
      (position - td.getBoundingClientRect().left)
      / (rowWidth / dur)
    )
    return from.clone().add(reservationStart * 24, 'hours')
  }

  calculateReservationFromDiv = (left, width) => {
    if (!this.newReservationDiv) {
      return {}
    }

    const { from, duration } = this.props
    const divDimensions = this.newReservationDiv.getBoundingClientRect()
    // in days
    const dur = (duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS)
    const rowWidth = (
      this.td.parentElement.getBoundingClientRect().width
      - this.td.parentElement.children[0].getBoundingClientRect().width
    )
    const reservationStart = (
      ((left || divDimensions.left) - this.td.getBoundingClientRect().left)
      / (rowWidth / dur)
    )
    const reservationDuration = (width || divDimensions.width) / (rowWidth / dur)
    const beginsAt = from.clone().add(reservationStart * 24, 'hours')
    const endsAt = beginsAt.clone().add(reservationDuration * 24, 'hours')

    return { beginsAt, endsAt }
  }

  isForCurrentUser = reservation => {
    const { currentUser } = this.props
    return currentUser && reservation.user && currentUser.id === reservation.user.id
  }

  shouldShowDetails = reservation => {
    const { showDetails } = this.props
    const forCurrentUser = this.isForCurrentUser(reservation)
    const clientUser = reservation.client ? reservation.client.client_user : {}
    return showDetails
    || (clientUser && clientUser.admin)
    || (clientUser && clientUser.secretary)
    || forCurrentUser
  }

  composeLabel = reservation => {
    const details = this.shouldShowDetails(reservation)
    return details
    && [
      reservation.car && reservation.car.licence_plate,
      reservation.user && reservation.user.full_name
    ].filter(o => o).join(' - ')
  }

  // width of time window
  rowWidth = () => this.row ? this.row.getBoundingClientRect().width - 62 : 0

  cellDuration = () => {
    const { duration } = this.props
    return duration === 'day' ? 1 : 12 // hours
  }

  windowLength = () => {
    const { duration } = this.props
    return (duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS)
  }

  // can be sorted as string - might be faster
  sortByDate = (a, b) => (a.begins_at < b.begins_at ? -1 : (a.begins_at > b.begins_at ? 1 : 0))

  estimatePosition = (reservation, cellWidth) => {
    const { from } = this.props
    const cellDuration = this.cellDuration()
    const fromDate = from.toDate()
    const beginning = firstDateIsBefore(reservation.begins_at, fromDate)
      ? fromDate
      : reservation.begins_at
    const dur = diff(firstDateIsBeforeOrEqual(beginning, fromDate)
      ? fromDate
      : beginning, reservation.ends_at, 'hours', true)
    const durationInCells = dur / cellDuration
    const fromStart = diff(fromDate, beginning, 'hours', true)

    return {
      ...reservation,
      estimatedWidth:     durationInCells * cellWidth, // in px
      estimatedStart:     (fromStart / cellDuration) * cellWidth, // in px
      estimatedTextWidth: getTextWidth14px(this.composeLabel(reservation)) // in px
    }
  }

  estimateSpaceAround = (estimatedStart, estimatedWidth, index, arr) => {
    const endOfReservationBefore = index === 0
      ? 0
      : arr[index - 1].estimatedStart + arr[index - 1].estimatedWidth
    const startOfReservationAfter = index + 1 < arr.length
      ? arr[index + 1].estimatedStart
      : this.rowWidth

    return {
      // in px
      estimatedLeftSpace:  estimatedStart - endOfReservationBefore,
      // in px
      estimatedRightSpace: startOfReservationAfter - (estimatedStart + estimatedWidth)
    }
  }

  estimateTextPosition = (reservation, index, arr) => {
    const {
      estimatedWidth,
      estimatedTextWidth,
      estimatedStart,
      ...resetOfReservation
    } = reservation

    const {
      estimatedLeftSpace,
      estimatedRightSpace
    } = this.estimateSpaceAround(estimatedStart, estimatedWidth, index, arr)

    const result = {
      ...resetOfReservation,
      displayTextLeft:  false,
      displayTextRight: false,
      estimatedTextWidth
    }

    if (
      estimatedWidth < estimatedTextWidth
      && estimatedLeftSpace > estimatedTextWidth
    ) {
      result.displayTextLeft = true
      return result
    }

    if (
      estimatedWidth < estimatedTextWidth
      && !reservation.displayTextLeft
      && (
        index + 1 < arr.length
          ? estimatedRightSpace - arr[index + 1].estimatedTextWidth > estimatedTextWidth
          : estimatedRightSpace > estimatedTextWidth
      )
    ) {
      result.displayTextRight = true
      return result
    }

    return result
  }

  renderReservation = (reservation, firstCellIndex, cellWidth) => {
    const {
      duration, from, onReservationClick, isIe
    } = this.props
    const cellDuration = duration === 'day' ? 1 : 12 // hours
    const details = this.shouldShowDetails(reservation)
    const forCurrentUser = this.isForCurrentUser(reservation)
    const currentTime = new Date()
    const fromDate = from.toDate()

    const classes = [
      styles.reservation,
      reservation.displayTextLeft && styles.textOnLeft,
      reservation.displayTextRight && styles.textOnRight,
      firstDateIsBefore(currentTime, reservation.begins_at) && styles.future,
      dateIsInRange(
        currentTime,
        reservation.begins_at,
        reservation.ends_at
      ) && styles.ongoing,
      firstDateIsAfter(currentTime, reservation.ends_at) && styles.fulfilled,
      details
        ? forCurrentUser
          ? styles.forCurrentUser
          : styles.forFellowUser
        : styles.noDetails,
      !reservation.approved && styles.notApproved
    ]

    const beginning = reservation.begins_at
    const dur = diff(firstDateIsBeforeOrEqual(beginning, fromDate)
      ? fromDate
      : beginning, reservation.ends_at, 'hours', true)

    const durationInCells = dur / cellDuration

    const firstCellOffset = firstDateIsBeforeOrEqual(beginning, fromDate)
      ? 0
      : ((beginning.getHours() + (beginning.getMinutes() / 60)) % cellDuration) / cellDuration

    const left = firstDateIsBeforeOrEqual(beginning, fromDate) ? 0 : (firstCellOffset * cellWidth)
    const width = Array(...{ length: Math.floor(durationInCells + firstCellOffset) })
      .map((cell, index) => firstCellIndex + index)
      .reduce((sum, cell) => (
        sum + (this.row.childNodes[cell]
          ? cellWidth
          : 0)
      //                                                              due to first cell offset
      ), cellWidth * ((durationInCells + firstCellOffset) % 1)) - left

    const text = this.composeLabel(reservation)

    return (
      <Reservation
        reservation={reservation}
        showDetails={details}
        classes={classes.filter(o => o).join(' ')}
        left={left}
        width={width}
        text={text}
        onClick={onReservationClick}
        height={isIe && this.td ? `${this.td.clientHeight - 5}px` : 'calc(100% - 5px)'}
        isIe={isIe}
      />
    )
  }

  renderCell = (index, renderTextInReservation, cellWidth) => {
    const {
      from, duration, place, now, isIe
    } = this.props
    const {
      showTime, time, mouseX, mouseY, rendered
    } = this.state
    const fromDate = from.toDate()
    const date = dateAdd(
      fromDate,
      (duration === 'day' ? 0 : index / 2) * 24,
      'hours'
    )


    const style = {
      left:  this.state.left + 'px',
      width: this.state.width + 'px'
    }

    if (this.isIe && this.td) {
      style.height = `${this.td.clientHeight - 5}px`
    }

    let placeReservation = place.reservations.sort(this.sortByDate)

    if (!renderTextInReservation) {
      placeReservation = placeReservation
        .map(r => this.estimatePosition(r, cellWidth))
        .map(this.estimateTextPosition)
    }

    const newPlace = {
      ...place,
      reservations: placeReservation
    }

    return (
      <Cell
        place={place}
        index={index}
        now={now}
        from={from}
        isIe={isIe}
        duration={duration}
        cellWidth={cellWidth}
        renderTextInReservation={renderTextInReservation}
        rendered={rendered}
      />
    )
  }


  render() {
    const { place, duration, renderTextInReservation } = this.props
    const { rendered } = this.state
    const windowLength = this.windowLength() // in days
    const cellCount = windowLength * (duration === 'day' ? 24 : 2)

    const cellWidth = rendered && place.reservations.length > 0
      ? this.row.childNodes[1].getBoundingClientRect().width
      : 0

    const cells = new Array(cellCount)

    for (let i = 0; i < cells.length; i += 1) {
      cells[i] = this.renderCell(i, renderTextInReservation, cellWidth)
    }

    return (
      <tr
        key={`${place.floor}-${place.label}`}
        className={styles.bottomBorder}
        ref={row => { this.row = row }}
        onMouseDown={this.onMouseDown}
      >
        <td className={styles.rightBorder}>{`${place.floor}/${place.label}`}</td>
        {cells}
      </tr>
    )
  }
}

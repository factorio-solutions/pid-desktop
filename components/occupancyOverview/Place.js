import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Reservation from './Reservation'

import { DAY, WEEK_DAYS, MONTH_DAYS } from './OccupancyOverview'
import { getTextWidth14px }           from '../../helpers/estimateTextWidth'
import {
  firstDateIsBefore, diff, firstDateIsBeforeOrEqual, firstDateIsAfter, dateIsInRange, dateAdd
} from '../../helpers/dateHelper'

import detectIE from '../../helpers/internetExplorer'

import styles from './OccupancyOverview.scss'


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
    renderTextInReservation: PropTypes.bool
  }

  isIe = detectIE()

  constructor(props) {
    super(props)
    const { place } = props
    this.state = {
      rendered:  false,
      mouseDown: false,
      left:      0,
      width:     0,
      place
    }
  }

  componentWillMount() {
    this.setState(state => ({
      ...state,
      timeStamp: window.performance.now()
    }))
  }

  componentDidMount() {
    const { place, timeStamp } = this.state
    console.log(`Place ${place.floor}-${place.label}: ${window.performance.now() - timeStamp}`)
    this.setState(state => ({
      ...state,
      rendered: true
    }))

    this.row.addEventListener('mousemove', this.onMouseMove)
    this.row.addEventListener('mouseup', this.onMouseUp)
  }

  componentWillUnmount() {
    this.row.removeEventListener('mousemove', this.onMouseMove)
    this.row.removeEventListener('mouseup', this.onMouseUp)
  }

  onMouseDown = event => {
    const { left, mouseDown, width } = this.state
    const newWidth = mouseDown ? width : 0
    const newLeft = mouseDown
      ? left
      : event.clientX - this.td.getBoundingClientRect().left

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

  estimatePosition = reservation => {
    const { from, duration } = this.props
    const cellDuration = this.cellDuration()
    const rowWidth = this.rowWidth()
    const windowLength = this.windowLength() // in days
    const cellCount = windowLength * (duration === 'day' ? 24 : 2)
    const fromDate = from.toDate()
    const beginning = firstDateIsBefore(reservation.begins_at, fromDate)
      ? fromDate
      : reservation.begins_at
    const dur = diff(firstDateIsBeforeOrEqual(beginning, fromDate)
      ? fromDate
      : beginning, reservation.ends_at, 'hours', true)
    const durationInCells = dur / cellDuration
    const fromStart = diff(fromDate, beginning, 'days', true)

    return {
      ...reservation,
      estimatedWidth:     (durationInCells / cellCount) * rowWidth, // in px
      estimatedStart:     (fromStart / windowLength) * rowWidth, // in px
      estimatedTextWidth: getTextWidth14px(this.composeLabel(reservation)) // in px
    }
  }

  estimateSpaceArround = (reservation, index, arr) => {
    const { estimatedStart, ...restOfReservation } = reservation
    const endOfReservationBefore = index === 0
      ? 0
      : arr[index - 1].estimatedStart + arr[index - 1].estimatedWidth
    const startOfReservationAfter = index + 1 < arr.length
      ? arr[index + 1].estimatedStart
      : this.rowWidth

    return {
      ...restOfReservation,
      // in px
      estimatedLeftSpace:  estimatedStart - endOfReservationBefore,
      // in px
      estimatedRightSpace: startOfReservationAfter - (estimatedStart + reservation.estimatedWidth)
    }
  }

  displayTextOnLeft = reservation => ({
    ...reservation,
    displayTextLeft: reservation.estimatedWidth < reservation.estimatedTextWidth
      && reservation.estimatedLeftSpace > reservation.estimatedTextWidth
  })

  displayTextOnRight = (reservation, index, arr) => {
    const {
      estimatedWidth,
      estimatedTextWidth,
      estimatedLeftSpace,
      estimatedRightSpace,
      ...reserOfReservation
    } = reservation
    const right = estimatedWidth < estimatedTextWidth
      && !reservation.displayTextLeft
      && (
        index + 1 < arr.length
          ? estimatedRightSpace - arr[index + 1].estimatedTextWidth > estimatedTextWidth
          : estimatedRightSpace > estimatedTextWidth
      )

    return {
      ...reserOfReservation,
      displayTextRight: right,
      estimatedTextWidth
    }
  }

  renderReservation = (reservation, firstCellIndex) => {
    const { duration, from, onReservationClick } = this.props
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

    const firstCellWidth = this.row.childNodes[firstCellIndex]
      ? this.row.childNodes[firstCellIndex].getBoundingClientRect().width
      : 0

    const lastCellIndex = firstCellIndex + Math.floor(durationInCells + firstCellOffset)
    const lastCellWidth = this.row.childNodes[lastCellIndex]
      ? this.row.childNodes[lastCellIndex].getBoundingClientRect().width
      : 0

    const left = firstDateIsBeforeOrEqual(beginning, fromDate) ? 0 : (firstCellOffset * firstCellWidth)
    const width = Array(...{ length: Math.floor(durationInCells + firstCellOffset) })
      .map((cell, index) => firstCellIndex + index)
      .reduce((sum, cell) => (
        sum + (this.row.childNodes[cell]
          ? this.row.childNodes[cell].getBoundingClientRect().width
          : 0)
      //                                                              due to first cell offset
      ), lastCellWidth * ((durationInCells + firstCellOffset) % 1)) - left

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
        height={this.isIe && this.td ? `${this.td.clientHeight - 5}px` : 'calc(100% - 5px)'}
        isIe={this.isIe}
      />
    )
  }

  renderCell = (index, renderTextInReservation) => {
    const {
      from, duration, place, now
    } = this.props
    const fromDate = from.toDate()
    const date = dateAdd(
      fromDate,
      (duration === 'day' ? 0 : index / 2) * 24,
      'hours'
    )
    const classes = [
      (date.getDay() === 6 || date.getDay() === 0) && styles.weekend,
      duration !== 'day' && index % 2 === 1 && styles.rightBorder,
      duration !== 'day' && index % 2 === 0 && styles.rightBorderDotted,
      duration === 'day' && styles.rightBorderDotted,
      duration === 'day' && ((index + 1) % 6) - 3 === 0 && styles.rightBorder,
      duration === 'day' && (index + 1) % 6 === 0 && styles.boldBorder
    ]

    const renderReservationFactory = reservation => this.renderReservation(reservation, index + 1)

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
        .map(this.estimatePosition)
        .map(this.estimateSpaceArround)
        .map(this.displayTextOnLeft)
        .map(this.displayTextOnRight)
    }

    const newPlace = {
      ...place,
      reservations: placeReservation
    }

    return (
      <td
        key={`${place.floor}-${place.label}-${index}`}
        className={classes.filter(c => c).join(' ')}
        ref={td => { if (!index) this.td = td }}
      >
        {!index && now > 0 && (
          <div
            className={styles.now}
            style={{
              left:   now + 'px',
              height: this.isIe && this.td ? `${this.td.clientHeight}px` : '100%'
            }}
          />
        )}
        {
          !index
          && this.state.rendered
          && newPlace.reservations
            .filter(reservation => (
              firstDateIsBefore(reservation.begins_at, fromDate)
              && !firstDateIsBeforeOrEqual(reservation.ends_at, fromDate)
            ))
            .map(renderReservationFactory)
        }
        {
          this.state.rendered
          && newPlace.reservations
            .filter(reservation => {
              const beginsAt = reservation.begins_at
              if (duration === 'day') {
                return dateIsInRange(
                  beginsAt,
                  dateAdd(date, index, 'hours'),
                  dateAdd(date, index + 1, 'hours'),
                  '[)'
                )
              }
              return dateIsInRange(
                beginsAt,
                date,
                dateAdd(date, 12, 'hours'),
                '[)'
              )
            })
            .map(renderReservationFactory)
        }

        {this.state.mouseDown && !index && (
          <div
            className={styles.newReservation}
            style={style}
            ref={div => { this.newReservationDiv = div }}
          />
        )}
      </td>
    )
  }


  render() {
    const { place, duration, renderTextInReservation } = this.props
    const windowLength = this.windowLength() // in days
    const cellCount = windowLength * (duration === 'day' ? 24 : 2)

    const cells = new Array(cellCount)

    for (let i = 0; i < cellCount; i += 1) {
      cells[i] = this.renderCell(i, renderTextInReservation)
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

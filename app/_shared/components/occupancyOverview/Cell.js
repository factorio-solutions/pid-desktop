import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Reservation from './Reservation'

import {
  firstDateIsBefore, diff, firstDateIsBeforeOrEqual, firstDateIsAfter, dateIsInRange, dateAdd
} from '../../helpers/dateHelper'

import { cellDuration, WIDTH_OF_PLACE_LABEL_CELL } from './OccupancyOverview'

import { getTextWidth14px }           from '../../helpers/estimateTextWidth'

import styles from './OccupancyOverview.scss'

export default class Cell extends PureComponent {
  static propTypes = {
    place:                   PropTypes.object,
    index:                   PropTypes.number,
    now:                     PropTypes.number,
    from:                    PropTypes.object,
    isIe:                    PropTypes.bool,
    duration:                PropTypes.string,
    cellWidth:               PropTypes.number,
    renderTextInReservation: PropTypes.bool,
    rendered:                PropTypes.bool,
    onReservationClick:      PropTypes.func,
    showDetails:             PropTypes.bool,
    currentUser:             PropTypes.object,
    row:                     PropTypes.element
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


  renderReservation = (reservation, firstCellIndex, cellWidth) => {
    const {
      duration, from, onReservationClick, isIe, row
    } = this.props
    const cellDur = cellDuration(duration) // hours
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

    const durationInCells = dur / cellDur

    const firstCellOffset = firstDateIsBeforeOrEqual(beginning, fromDate)
      ? 0
      : ((beginning.getHours() + (beginning.getMinutes() / 60)) % cellDur) / cellDur

    const left = firstDateIsBeforeOrEqual(beginning, fromDate) ? 0 : (firstCellOffset * cellWidth)
    const width = Array(...{ length: Math.floor(durationInCells + firstCellOffset) })
      .map((cell, index) => firstCellIndex + index)
      .reduce((sum, cell) => (
        sum + (row.childNodes[cell]
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

  // can be sorted as string - might be faster
  sortByDate = (a, b) => (a.begins_at < b.begins_at ? -1 : (a.begins_at > b.begins_at ? 1 : 0))

  estimatePosition = (reservation, cellWidth) => {
    const { from, duration } = this.props
    const cellDur = cellDuration(duration)
    const fromDate = from.toDate()
    const beginning = firstDateIsBefore(reservation.begins_at, fromDate)
      ? fromDate
      : reservation.begins_at
    const dur = diff(firstDateIsBeforeOrEqual(beginning, fromDate)
      ? fromDate
      : beginning, reservation.ends_at, 'hours', true)
    const durationInCells = dur / cellDur
    const fromStart = diff(fromDate, beginning, 'hours', true)

    return {
      ...reservation,
      estimatedWidth:     durationInCells * cellWidth, // in px
      estimatedStart:     (fromStart / cellDur) * cellWidth, // in px
      estimatedTextWidth: getTextWidth14px(this.composeLabel(reservation)) // in px
    }
  }

  // width of time window
  rowWidth = () => this.row ? this.row.getBoundingClientRect().width - WIDTH_OF_PLACE_LABEL_CELL : 0

  estimateSpaceAround = (estimatedStart, estimatedWidth, index, arr) => {
    const endOfReservationBefore = index === 0
      ? 0
      : arr[index - 1].estimatedStart + arr[index - 1].estimatedWidth
    const startOfReservationAfter = index + 1 < arr.length
      ? arr[index + 1].estimatedStart
      : this.rowWidth()

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

  render() {
    const {
      place, index, now, from, isIe, duration, cellWidth, renderTextInReservation, rendered
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

    const renderReservationFactory = reservation => (
      this.renderReservation(reservation, index + 1, cellWidth)
    )

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
      <td
        key={`${place.floor}-${place.label}-${index}`}
        className={classes.filter(c => c).join(' ')}
        ref={td => this.td = td}
      >
        {!index && now > 0 && (
          <div
            className={styles.now}
            style={{
              left:   now + 'px',
              height: isIe && this.td ? `${this.td.clientHeight}px` : '100%'
            }}
          />
        )}
        {
          !index
          && rendered
          && newPlace.reservations
            .filter(reservation => (
              firstDateIsBefore(reservation.begins_at, fromDate)
              && !firstDateIsBeforeOrEqual(reservation.ends_at, fromDate)
            ))
            .map(renderReservationFactory)
        }
        {
          rendered
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
      </td>
    )
  }
}

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../tooltip/Tooltip'

import {
  firstDateIsBefore, diff, firstDateIsBeforeOrEqual, firstDateIsAfter, dateIsInRange, dateAdd
} from '../../helpers/dateHelper'

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
    rendered:                PropTypes.bool
  }

  render() {
    const {
      place, index, now, from, isIe, duration, cellWidth, renderTextInReservation, rendered
    } = this.props

    const {
      showTime, time, mouseX, mouseY
    } = this.state
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
      <td
        key={`${place.floor}-${place.label}-${index}`}
        className={classes.filter(c => c).join(' ')}
        ref={td => {
          if (!index) this.td = td
        }}
        onMouseMove={this.onTdMouseMove}
        onMouseLeave={this.onTdMouseLeave}
        onMouseEnter={this.onTdMouseEnter}
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

        {this.state.mouseDown && !index && (
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
    )
  }
}

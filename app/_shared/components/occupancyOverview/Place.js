import React, { Component, PropTypes }  from 'react'
import moment from 'moment'

import { DAY, WEEK_DAYS, MONTH_DAYS } from './OccupancyOverview'

import styles from './OccupancyOverview.scss'


export default class Place extends Component {
  static propTypes = {
    place:        PropTypes.object,
    duration:     PropTypes.string,
    from:         PropTypes.object,
    now:          PropTypes.number,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = { rendered: false }
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      rendered: true
    })
  }

  render() {
    const { place, duration, from, now, onMouseEnter, onMouseLeave } = this.props

    const renderReservation = (reservation, firstCellIndex) => {
      const classes = [
        styles.reservation,
        moment().isBefore(moment(reservation.begins_at)) && styles.future,
        moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) && styles.ongoing,
        moment().isAfter(moment(reservation.ends_at)) && styles.fulfilled
      ]

      const begining = moment(reservation.begins_at)
      const dur = moment(reservation.ends_at).diff(begining.isSameOrBefore(from) ? from : begining, 'hours', true)

      const cellDuration = duration === 'day' ? 1 : 12 // hours
      const durationInCells = dur / cellDuration

      const firstCellOffset = begining.isSameOrBefore(from) ? 0 : ((begining.hours() + (begining.minutes() / 60)) % cellDuration) / cellDuration
      const firstCellWidth = this.row.childNodes[firstCellIndex] ? this.row.childNodes[firstCellIndex].getBoundingClientRect().width : 0

      const lastCellIndex = firstCellIndex + Math.floor(durationInCells + firstCellOffset)
      const lastCellWidth = this.row.childNodes[lastCellIndex] ? this.row.childNodes[lastCellIndex].getBoundingClientRect().width : 0

      const left = begining.isSameOrBefore(from) ? 0 : (firstCellOffset * firstCellWidth)
      const width = Array(...{ length: Math.floor(durationInCells + firstCellOffset) })
      .map((cell, index) => firstCellIndex + index)
      .reduce(
        (sum, cell) => (sum + (this.row.childNodes[cell] ? this.row.childNodes[cell].getBoundingClientRect().width : 0)),
        lastCellWidth * ((durationInCells + firstCellOffset) % 1)
      ) - left // due to first cell offset

      const mouseEnter = e => onMouseEnter(e, reservation)

      return (<div
        onMouseEnter={mouseEnter}
        onMouseLeave={onMouseLeave}
        className={classes.filter(o => o).join(' ')}
        style={{
          left:  left + 'px',
          width: width <= 0 ? 1 : width + 'px' // -4 due to borders of width 1
        }}
      >
        {reservation.car ? reservation.car.licence_plate + ' - ' + reservation.user.full_name : reservation.user.full_name}
      </div>)
    }

    const renderCells = (o, index) => {
      const date = moment(from).locale(moment.locale()).add((duration === 'day' ? 0 : index / 2) * 24, 'hours')
      const classes = [
        (date.isoWeekday() === 6 || date.isoWeekday() === 7) && styles.weekend,
        duration !== 'day' && index % 2 === 1 && styles.rightBorder,
        duration !== 'day' && index % 2 === 0 && styles.rightBorderDotted,
        duration === 'day' && styles.rightBorderDotted,
        duration === 'day' && ((index + 1) % 6) - 3 === 0 && styles.rightBorder,
        duration === 'day' && (index + 1) % 6 === 0 && styles.boldBorder
      ]
      const renderderReservationFactory = reservation => renderReservation(reservation, index + 1)

      return (<td key={`${place.floor}-${place.label}-${index}`} className={classes.filter(o => o).join(' ')} >
        {!index && now > 0 && <div className={styles.now} style={{ left: now + 'px' }} />}
        {!index && this.state.rendered && place.reservations
          .filter(reservation => moment(reservation.begins_at).isBefore(from) && !moment(reservation.ends_at).isSameOrBefore(from))
          .map(renderderReservationFactory)
        }
        {this.state.rendered && place.reservations
          .filter(reservation => duration === 'day' ?
            moment(reservation.begins_at).isBetween(date.clone().add(index, 'hours'), date.clone().add(index + 1, 'hours'), null, '[)') :
            moment(reservation.begins_at).isBetween(date, date.clone().add(12, 'hours'), null, '[)'))
          .map(renderderReservationFactory)
        }
      </td>)
    }

    return (
      <tr key={`${place.floor}-${place.label}`} className={styles.bottomBorder} ref={row => { this.row = row }}>
        <td className={styles.rightBorder}>{`${place.floor}/${place.label}`}</td>
        {Array(...{ length: (duration === 'day' ? DAY * 12 : duration === 'week' ? WEEK_DAYS : MONTH_DAYS) * 2 }).map(renderCells)}
      </tr>
    )
  }
}

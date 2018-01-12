import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import moment from 'moment'

import { DAY, WEEK_DAYS, MONTH_DAYS } from './OccupancyOverview'
import { getTextWidth14px } from '../../helpers/estimateTextWidth'

import styles from './OccupancyOverview.scss'


class Place extends Component {
  static propTypes = {
    pageBase:     PropTypes.object,
    place:        PropTypes.object,
    duration:     PropTypes.string,
    from:         PropTypes.object,
    now:          PropTypes.number,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    showDetails:  PropTypes.bool
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

  isForCurrentUser = reservation => {
    const { pageBase } = this.props
    return pageBase.current_user && pageBase.current_user.id === reservation.user.id
  }

  shouldShowDetails = reservation => {
    const { showDetails } = this.props
    const forCurrentUser = this.isForCurrentUser(reservation)
    const clientUser = reservation.client ? reservation.client.client_user : {}
    return showDetails || clientUser.admin || clientUser.secretary || forCurrentUser
  }

  composeLabel = reservation => {
    const details = this.shouldShowDetails(reservation)
    return details && `${reservation.car ? reservation.car.licence_plate + ' - ' + reservation.user.full_name : reservation.user.full_name}`
  }

  render() {
    const { place, duration, from, now, onMouseEnter, onMouseLeave } = this.props
    const rowWidth = this.row ? this.row.getBoundingClientRect().width - 62 : 0 // width of time window
    const cellDuration = duration === 'day' ? 1 : 12 // hours
    const windowLength = (duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS) // in days
    const cellCount = windowLength * (duration === 'day' ? 24 : 2)

    const estimatePosition = reservation => {
      const begining = moment(reservation.begins_at)
      const dur = moment(reservation.ends_at).diff(begining.isSameOrBefore(from) ? from : begining, 'hours', true)
      const durationInCells = dur / cellDuration
      const fromStart = begining.diff(from, 'days', true)
      const text = this.composeLabel(reservation)

      return {
        ...reservation,
        estimatedWidth:     (durationInCells / cellCount) * rowWidth, // in px
        estimatedStart:     (fromStart / windowLength) * rowWidth, // in px
        estimatedTextWidth: getTextWidth14px(text) // in px
      }
    }

    const estimateSpaceArround = (reservation, index, arr) => {
      const { estimatedStart, ...restOfReservation } = reservation
      const endOfReservationBefore = index === 0 ? 0 : arr[index - 1].estimatedStart + arr[index - 1].estimatedWidth
      const startOfReservationAfter = index + 1 < arr.length ? arr[index + 1].estimatedStart : rowWidth

      return {
        ...restOfReservation,
        estimatedLeftSpace:  estimatedStart - endOfReservationBefore, // in px
        estimatedRightSpace: startOfReservationAfter - (estimatedStart + reservation.estimatedWidth) // in px
      }
    }

    const displayTextOnLeft = reservation => {
      const { estimatedWidth, estimatedTextWidth, estimatedLeftSpace } = reservation
      const left = estimatedWidth < estimatedTextWidth && estimatedLeftSpace > estimatedTextWidth

      return {
        ...reservation,
        displayTextLeft: left
      }
    }

    const displayTextOnRight = (reservation, index, arr) => {
      const { estimatedWidth, estimatedTextWidth, estimatedLeftSpace, estimatedRightSpace, ...reserOfReservation } = reservation
      const right = estimatedWidth < estimatedTextWidth && !reservation.displayTextLeft && (index + 1 < arr.length ?
      estimatedRightSpace - arr[index + 1].estimatedTextWidth > estimatedTextWidth :
      estimatedRightSpace > estimatedTextWidth)

      return {
        ...reserOfReservation,
        displayTextRight: right
      }
    }

    const newPlace = { ...place,
      reservations: place.reservations
        .map(estimatePosition)
        .map(estimateSpaceArround)
        .map(displayTextOnLeft)
        .map(displayTextOnRight)
    }

    const renderReservation = (reservation, firstCellIndex) => {
      const details = this.shouldShowDetails(reservation)
      const forCurrentUser = this.isForCurrentUser(reservation)

      const classes = [
        styles.reservation,
        reservation.displayTextLeft && styles.textOnLeft,
        reservation.displayTextRight && styles.textOnRight,
        moment().isBefore(moment(reservation.begins_at)) && styles.future,
        moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) && styles.ongoing,
        moment().isAfter(moment(reservation.ends_at)) && styles.fulfilled,
        details ? forCurrentUser ? styles.forCurrentUser : styles.forFellowUser : styles.noDetails
      ]

      const begining = moment(reservation.begins_at)
      const dur = moment(reservation.ends_at).diff(begining.isSameOrBefore(from) ? from : begining, 'hours', true)

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
      const text = this.composeLabel(reservation)

      return (<div
        onMouseEnter={mouseEnter}
        onMouseLeave={onMouseLeave}
        className={classes.filter(o => o).join(' ')}
        style={{
          left:  left + 'px',
          width: width <= 0 ? 1 : width + 'px'
        }}
      >
        <span>{text}</span>
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
        {!index && this.state.rendered && newPlace.reservations
          .filter(reservation => moment(reservation.begins_at).isBefore(from) && !moment(reservation.ends_at).isSameOrBefore(from))
          .map(renderderReservationFactory)
        }
        {this.state.rendered && newPlace.reservations
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
        {Array(...{ length: cellCount }).map(renderCells)}
      </tr>
    )
  }
}


export default connect(
  state => ({ pageBase: state.pageBase }),
  () => ({})
)(Place)

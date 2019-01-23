import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

import Reservation from './Reservation'

import { DAY, WEEK_DAYS, MONTH_DAYS } from './OccupancyOverview'
import { getTextWidth14px }           from '../../helpers/estimateTextWidth'

import detectIE from '../../helpers/internetExplorer'

import styles from './OccupancyOverview.scss'


export default class Place extends Component {
  static propTypes = {
    currentUser:        PropTypes.object,
    setNewReservation:  PropTypes.func,
    place:              PropTypes.object,
    duration:           PropTypes.string,
    from:               PropTypes.object,
    now:                PropTypes.number,
    showDetails:        PropTypes.bool,
    onReservationClick: PropTypes.func
  }

  isIe = detectIE()

  constructor(props) {
    super(props)
    this.state = {
      rendered:  false,
      mouseDown: false,
      left:      0,
      width:     0
    }
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      rendered: true
    })

    document.body.addEventListener('mousemove', this.onMouseMove)
    document.body.addEventListener('mouseup', this.onMouseUp)
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.onMouseMove)
    document.body.removeEventListener('mouseup', this.onMouseUp)
  }

  onMouseDown = event => {
    const newWidth = this.state.mouseDown ? this.state.width : 0
    const newLeft = this.state.mouseDown ? this.state.left : event.clientX - this.td.getBoundingClientRect().left

    this.setState({
      ...this.state,
      mouseDown: true,
      width:     newWidth,
      left:      newLeft
    })
  }

  onMouseMove = event => {
    if (this.state.mouseDown) {
      const newWidth = event.clientX - this.td.getBoundingClientRect().left - this.state.left
      const range = this.calculateReservationFromDiv(undefined, newWidth)
      const reservations = this.reservationsInRange(range.beginsAt, range.endsAt)

      if (!reservations.length) {
        this.setState({
          ...this.state,
          width: event.clientX - this.td.getBoundingClientRect().left - this.state.left
        })
      }
    }
  }

  onMouseUp = () => {
    const {
      setNewReservation: setNewReservationAction
    } = this.props
    if (this.newReservationDiv) {
      const range = this.calculateReservationFromDiv()
      const reservations = this.reservationsInRange(range.beginsAt, range.endsAt)

      setNewReservationAction(
        range.beginsAt,
        reservations.length ? moment(reservations[0].begins_at) : range.endsAt,
        this.props.place.id
      )
    }

    this.setState({ ...this.state, mouseDown: false })
  }

  reservationsInRange = (from, to) => this.props.place.reservations
    .filter(reservation => from.isBefore(moment(reservation.ends_at)))
    .filter(reservation => to.isAfter(moment(reservation.begins_at)))
    .sort((a, b) => moment(a.begins_at).diff(moment(b.begins_at)))

  calculateReservationFromDiv = (left, width) => {
    if (this.newReservationDiv) {
      const { from, duration } = this.props
      const divDimensions = this.newReservationDiv.getBoundingClientRect()
      const dur = (duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS) // in days
      const rowWidth = this.td.parentElement.getBoundingClientRect().width - this.td.parentElement.children[0].getBoundingClientRect().width
      const reservationStart = ((left || divDimensions.left) - this.td.getBoundingClientRect().left) / (rowWidth / dur)
      const reservationDuration = (width || divDimensions.width) / (rowWidth / dur)
      const beginsAt = from.clone().add(reservationStart * 24, 'hours')
      const endsAt = beginsAt.clone().add(reservationDuration * 24, 'hours')

      return { beginsAt, endsAt }
    }
    return {}
  }

  isForCurrentUser = reservation => {
    const { currentUser } = this.props
    return currentUser && reservation.user && currentUser.id === reservation.user.id
  }

  shouldShowDetails = reservation => {
    const { showDetails } = this.props
    const forCurrentUser = this.isForCurrentUser(reservation)
    const clientUser = reservation.client ? reservation.client.client_user : {}
    return showDetails || (clientUser && clientUser.admin) || (clientUser && clientUser.secretary) || forCurrentUser
  }

  composeLabel = reservation => {
    const details = this.shouldShowDetails(reservation)
    return details && [ reservation.car && reservation.car.licence_plate, reservation.user && reservation.user.full_name ].filter(o => o).join(' - ')
  }

  rowWidth = () => this.row ? this.row.getBoundingClientRect().width - 62 : 0 // width of time window

  cellDuration = () => {
    const { duration } = this.props
    return duration === 'day' ? 1 : 12 // hours
  }

  windowLength = () => {
    const { duration } = this.props
    return (duration === 'day' ? DAY : duration === 'week' ? WEEK_DAYS : MONTH_DAYS)
  }

  sortByDate = (a, b) => (a.begins_at < b.begins_at ? -1 : (a.begins_at > b.begins_at ? 1 : 0)) // can be sorted as string - might be faster

  estimatePosition = reservation => {
    const { from, duration } = this.props
    const cellDuration = this.cellDuration()
    const rowWidth = this.rowWidth()
    const windowLength = this.windowLength() // in days
    const cellCount = windowLength * (duration === 'day' ? 24 : 2)
    const beginning = moment(reservation.begins_at).isBefore(from) ? from : moment(reservation.begins_at)
    const dur = moment(reservation.ends_at).diff(beginning.isSameOrBefore(from) ? from : beginning, 'hours', true)
    const durationInCells = dur / cellDuration
    const fromStart = beginning.diff(from, 'days', true)

    return {
      ...reservation,
      estimatedWidth:     (durationInCells / cellCount) * rowWidth, // in px
      estimatedStart:     (fromStart / windowLength) * rowWidth, // in px
      estimatedTextWidth: getTextWidth14px(this.composeLabel(reservation)) // in px
    }
  }

  estimateSpaceArround = (reservation, index, arr) => {
    const { estimatedStart, ...restOfReservation } = reservation
    const endOfReservationBefore = index === 0 ? 0 : arr[index - 1].estimatedStart + arr[index - 1].estimatedWidth
    const startOfReservationAfter = index + 1 < arr.length ? arr[index + 1].estimatedStart : this.rowWidth

    return {
      ...restOfReservation,
      estimatedLeftSpace:  estimatedStart - endOfReservationBefore, // in px
      estimatedRightSpace: startOfReservationAfter - (estimatedStart + reservation.estimatedWidth) // in px
    }
  }

  displayTextOnLeft = reservation => ({
    ...reservation,
    displayTextLeft: reservation.estimatedWidth < reservation.estimatedTextWidth && reservation.estimatedLeftSpace > reservation.estimatedTextWidth
  })

  displayTextOnRight = (reservation, index, arr) => {
    const { estimatedWidth, estimatedTextWidth, estimatedLeftSpace, estimatedRightSpace, ...reserOfReservation } = reservation
    const right = estimatedWidth < estimatedTextWidth && !reservation.displayTextLeft && (index + 1 < arr.length ?
      estimatedRightSpace - arr[index + 1].estimatedTextWidth > estimatedTextWidth :
      estimatedRightSpace > estimatedTextWidth)

    return {
      ...reserOfReservation,
      displayTextRight: right
    }
  }

  renderReservation = (reservation, firstCellIndex) => {
    const { duration, from, onReservationClick } = this.props
    const cellDuration = duration === 'day' ? 1 : 12 // hours
    const details = this.shouldShowDetails(reservation)
    const forCurrentUser = this.isForCurrentUser(reservation)

    const classes = [
      styles.reservation,
      reservation.displayTextLeft && styles.textOnLeft,
      reservation.displayTextRight && styles.textOnRight,
      moment().isBefore(moment(reservation.begins_at)) && styles.future,
      moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) && styles.ongoing,
      moment().isAfter(moment(reservation.ends_at)) && styles.fulfilled,
      details ? forCurrentUser ? styles.forCurrentUser : styles.forFellowUser : styles.noDetails,
      !reservation.approved && styles.notApproved
    ]

    const beginning = moment(reservation.begins_at)
    const dur = moment(reservation.ends_at).diff(beginning.isSameOrBefore(from) ? from : beginning, 'hours', true)

    const durationInCells = dur / cellDuration

    const firstCellOffset = beginning.isSameOrBefore(from) ? 0 : ((beginning.hours() + (beginning.minutes() / 60)) % cellDuration) / cellDuration
    const firstCellWidth = this.row.childNodes[firstCellIndex] ? this.row.childNodes[firstCellIndex].getBoundingClientRect().width : 0

    const lastCellIndex = firstCellIndex + Math.floor(durationInCells + firstCellOffset)
    const lastCellWidth = this.row.childNodes[lastCellIndex] ? this.row.childNodes[lastCellIndex].getBoundingClientRect().width : 0

    const left = beginning.isSameOrBefore(from) ? 0 : (firstCellOffset * firstCellWidth)
    const width = Array(...{ length: Math.floor(durationInCells + firstCellOffset) })
      .map((cell, index) => firstCellIndex + index)
      .reduce(
        (sum, cell) => (sum + (this.row.childNodes[cell] ? this.row.childNodes[cell].getBoundingClientRect().width : 0)),
        lastCellWidth * ((durationInCells + firstCellOffset) % 1)
      ) - left // due to first cell offset

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
      />
    )
  }

  renderCells = (o, index) => {
    const {
      from, duration, place, now
    } = this.props
    const date = moment(from).locale(moment.locale()).add((duration === 'day' ? 0 : index / 2) * 24, 'hours')
    const classes = [
      (date.isoWeekday() === 6 || date.isoWeekday() === 7) && styles.weekend,
      duration !== 'day' && index % 2 === 1 && styles.rightBorder,
      duration !== 'day' && index % 2 === 0 && styles.rightBorderDotted,
      duration === 'day' && styles.rightBorderDotted,
      duration === 'day' && ((index + 1) % 6) - 3 === 0 && styles.rightBorder,
      duration === 'day' && (index + 1) % 6 === 0 && styles.boldBorder
    ]
    const renderderReservationFactory = reservation => this.renderReservation(reservation, index + 1)

    const style = {
      left:  this.state.left + 'px',
      width: this.state.width + 'px'
    }

    const newPlace = {
      ...place,
      reservations: place.reservations
        .sort(this.sortByDate)
        .map(this.estimatePosition)
        .map(this.estimateSpaceArround)
        .map(this.displayTextOnLeft)
        .map(this.displayTextOnRight)
    }

    return (
      <td
        key={`${place.floor}-${place.label}-${index}`}
        className={classes.filter(c => c).join(' ')}
        ref={td => { if (!index) this.td = td }}
      >
        {!index && now > 0 && <div className={styles.now} style={{ left: now + 'px', height: this.isIe && this.td ? `${this.td.clientHeight}px` : '100%' }} />}
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

        {this.state.mouseDown && !index &&
        <div
          className={styles.newReservation}
          style={style}
          ref={div => { this.newReservationDiv = div }}
        />
        }
      </td>
    )
  }


  render() {
    const { place, duration } = this.props
    const windowLength = this.windowLength() // in days
    const cellCount = windowLength * (duration === 'day' ? 24 : 2)

    return (
      <tr
        key={`${place.floor}-${place.label}`}
        className={styles.bottomBorder}
        ref={row => { this.row = row }}
        onMouseDown={this.onMouseDown}
      >
        <td className={styles.rightBorder}>{`${place.floor}/${place.label}`}</td>
        {Array(...{ length: cellCount }).map(this.renderCells)}
      </tr>
    )
  }
}

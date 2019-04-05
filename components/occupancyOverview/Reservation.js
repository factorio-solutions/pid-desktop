import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import Tooltip from '../tooltip/Tooltip'

import { t } from '../../modules/localization/localization'

import styles from './OccupancyOverview.scss'

const INIT_STATE = {
  visible: false,
  mouseX:  0,
  mouseY:  0
}

const ReservationContent = ({
  showDetails,
  clientUser,
  currentUser,
  reservation
}) => {
  return (
    showDetails
    || (clientUser && (clientUser.admin || clientUser.secretary))
    || (currentUser && currentUser.id === reservation.user.id)
  )
    ? (
      <table className={styles.tooltipTable}>
        <tbody>
          {!reservation.approved && (
            <tr>
              <td colSpan={2} className={styles.notApprovedLabel}>
                {t([ 'occupancy', 'reservationNotApproved' ])}
              </td>
            </tr>
          )}
          <tr>
            <td>
              {t([ 'occupancy', 'reservationsId' ])}
            </td>
            <td>
              {reservation.id}
            </td>
          </tr>
          <tr>
            <td>
              {t([ 'occupancy', 'driver' ])}
            </td>
            <td>
              {reservation.user && reservation.user.full_name}
            </td>
          </tr>
          {reservation.client && (
            <tr>
              <td>
                {t([ 'occupancy', 'client' ])}
              </td>
              <td>
                {reservation.client.name}
              </td>
            </tr>
          )}
          <tr>
            <td>{t([ 'occupancy', 'type' ])}</td>
            <td>
              {reservation.reservation_case === 'guest'
                ? t([ 'reservations', 'host' ])
                : reservation.reservation_case === 'internal'
                  ? t([ 'reservations', 'internal' ])
                  : reservation.reservation_case === 'mr_parkit'
                    ? t([ 'reservations', 'mrParkit' ])
                    : t([ 'reservations', 'visitor' ])
              }
            </td>
          </tr>
          <tr>
            <td>
              {t([ 'occupancy', 'period' ])}
            </td>
            <td>
              {moment(reservation.begins_at).format('DD.MM.YYYY HH:mm')}
              {' - '}
              {moment(reservation.ends_at).format('DD.MM.YYYY HH:mm')}
            </td>
          </tr>
          <tr>
            <td>
              {t([ 'occupancy', 'licencePlate' ])}
            </td>
            <td>
              {reservation.car && reservation.car.licence_plate}
            </td>
          </tr>
        </tbody>
      </table>
    )
    : (
      <table className={styles.tooltipTable}>
        <tbody>
          <tr>
            <td colSpan={2} className={styles.notApprovedLabel}>
              {t([ 'occupancy', 'detailsInaccessible' ])}
            </td>
          </tr>
          <tr>
            <td>
              {t([ 'occupancy', 'period' ])}
            </td>
            <td>
              {reservation.begins_at.format('DD.MM.YYYY HH:mm')}
              {' - '}
              {reservation.ends_at.format('DD.MM.YYYY HH:mm')}
            </td>
          </tr>
        </tbody>
      </table>
    )
}

ReservationContent.propTypes = {
  showDetails: PropTypes.bool,
  clientUser:  PropTypes.object,
  currentUser: PropTypes.object,
  reservation: PropTypes.object
}

class Reservation extends Component {
  static propTypes = {
    reservation: PropTypes.object,
    currentUser: PropTypes.object,
    showDetails: PropTypes.bool,
    classes:     PropTypes.array,
    left:        PropTypes.number,
    width:       PropTypes.number,
    text:        PropTypes.string,
    onClick:     PropTypes.func,
    height:      PropTypes.string,
    isIe:        PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = INIT_STATE
  }

  onReservationClick = () => this.props.onClick(this.props.reservation)

  // place blocked by reservation - dont propagate event
  onReservationMouseDown = event => event.stopPropagation()

  mouseEnter = e => {
    this.setState({
      mouseX:  e.clientX + 20,
      mouseY:  e.clientY,
      visible: true
    })
  }

  mouseLeave = () => this.setState(INIT_STATE)

  render() {
    const {
      classes, left, width, text, reservation, currentUser, showDetails, height, isIe
    } = this.props
    const {
      mouseX, mouseY, visible
    } = this.state

    const style = {
      left:  left + 'px',
      width: width <= 0 ? 1 : width + 'px',
      height
    }

    const clientUser = reservation.client ? reservation.client.client_user : {}

    const spanStyle = {}
    // IE do not handles relative units.
    if (isIe) {
      if (reservation.displayTextRight) {
        spanStyle.transform = `translateX(${width + 3}px)`
      } else if (reservation.displayTextLeft) {
        spanStyle.transform = `translateX(${-reservation.estimatedTextWidth + 5}px)`
      }
    }

    return (
      <div>
        <div
          onMouseEnter={this.mouseEnter}
          onMouseMove={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
          onMouseDown={this.onReservationMouseDown}
          className={classes}
          style={style}
          onClick={this.onReservationClick}
        >
          <span style={spanStyle}>{text}</span>
        </div>
        {visible && (
          <Tooltip
            content={(
              <ReservationContent
                showDetails={showDetails}
                clientUser={clientUser}
                currentUser={currentUser}
                reservation={reservation}
              />
            )}
            mouseX={mouseX}
            mouseY={mouseY}
            visible
            height="500px"
          />
        )}
      </div>
    )
  }
}

export default connect(
  state => ({ currentUser: state.pageBase.current_user }),
  () => ({})
)(Reservation)

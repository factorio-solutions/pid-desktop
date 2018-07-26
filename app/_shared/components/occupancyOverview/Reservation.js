import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import moment                          from 'moment'

import Tooltip from '../tooltip/Tooltip'

import { t } from '../../modules/localization/localization'

import styles from './OccupancyOverview.scss'

const INIT_STATE = {
  visible: false,
  mouseX:  0,
  mouseY:  0
}


class Reservation extends Component {
  static propTypes = {
    reservation: PropTypes.object,
    pageBase:    PropTypes.object,
    showDetails: PropTypes.bool,
    classes:     PropTypes.array,
    left:        PropTypes.number,
    width:       PropTypes.number,
    text:        PropTypes.string,
    onClick:     PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = INIT_STATE
  }

  onReservationClick = () => this.props.onClick(this.props.reservation)
  onReservationMouseDown = event => event.stopPropagation() // place blocked by reservation - dont propagate event

  mouseEnter = e => {
    this.setState({
      mouseX:  e.clientX + 20,
      mouseY:  e.clientY,
      visible: true
    })
  }

  mouseLeave = () => this.setState(INIT_STATE)

  render() {
    const { classes, left, width, text, reservation, pageBase, showDetails } = this.props

    const style = {
      left:  left + 'px',
      width: width <= 0 ? 1 : width + 'px'
    }

    const clientUser = reservation.client ? reservation.client.client_user : {}
    const content = (showDetails || (clientUser && clientUser.admin) || (clientUser && clientUser.secretary) ||
    (pageBase.current_user && pageBase.current_user.id === reservation.user.id)) ?
      (<table className={styles.tooltipTable}>
        <tbody>
          {!reservation.approved && <tr><td colSpan={2} className={styles.notApprovedLabel}>{t([ 'occupancy', 'reservationNotApproved' ])}</td></tr>}
          <tr><td>{t([ 'occupancy', 'reservationsId' ])}</td><td>{reservation.id}</td></tr>
          <tr><td>{t([ 'occupancy', 'driver' ])}</td><td>{reservation.user.full_name}</td></tr>
          {reservation.client && <tr><td>{t([ 'occupancy', 'client' ])}</td><td>{reservation.client.name}</td></tr>}
          <tr>
            <td>{t([ 'occupancy', 'type' ])}</td>
            <td>
              {reservation.reservation_case === 'guest' ?
                t([ 'reservations', 'host' ]) :
                reservation.reservation_case === 'internal' ?
                  t([ 'reservations', 'internal' ]) :
                  reservation.reservation_case === 'mr_parkit' ?
                    t([ 'reservations', 'mrParkit' ]) :
                    t([ 'reservations', 'visitor' ])
              }
            </td>
          </tr>
          <tr><td>{t([ 'occupancy', 'period' ])}</td><td>{moment(reservation.begins_at).format('DD.MM.YYYY HH:mm')} - {moment(reservation.ends_at).format('DD.MM.YYYY HH:mm')}</td></tr>
          <tr><td>{t([ 'occupancy', 'licencePlate' ])}</td><td>{reservation.car && reservation.car.licence_plate}</td></tr>
        </tbody>
      </table>) :
      (<table className={styles.tooltipTable}>
        <tbody>
          <tr><td colSpan={2} className={styles.notApprovedLabel}>{t([ 'occupancy', 'detailsInaccessible' ])}</td></tr>
          <tr><td>{t([ 'occupancy', 'period' ])}</td><td>{moment(reservation.begins_at).format('DD.MM.YYYY HH:mm')} - {moment(reservation.ends_at).format('DD.MM.YYYY HH:mm')}</td></tr>
        </tbody>
      </table>)

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
          <span>{text}</span>
        </div>
        {this.state.visible && <Tooltip
          content={content}
          mouseX={this.state.mouseX}
          mouseY={this.state.mouseY}
          visible
          height="500px"
        />}
      </div>
    )
  }
}

export default connect(
  state => ({ pageBase: state.pageBase }),
  () => ({})
)(Reservation)

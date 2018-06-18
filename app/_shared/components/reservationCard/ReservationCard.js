import React, { Component, PropTypes } from 'react'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'
import { connect }                     from 'react-redux'
import { withRouter }                  from 'react-router'

import Swipe from '../swipe/Swipe'

import * as paths              from '../../../_resources/constants/RouterPaths'
import { t }                   from '../../modules/localization/localization'
import * as reservationActions from '../../actions/mobile.reservations.actions'

import styles from './ReservationCard.scss'


export class ReservationCard extends Component {
  static propTypes = {
    actions:      PropTypes.object,
    reservation:  PropTypes.object,
    mobileHeader: PropTypes.object,
    router:       PropTypes.object,
    personal:     PropTypes.bool
  }

  onSwipe = gate => () => {
    const { actions, reservation } = this.props
    actions.openGarage(reservation, gate.id)
  }

  toReservation = () => {
    const { router, reservation, mobileHeader } = this.props
    router.push((mobileHeader.personal ?
      paths.RESERVATION_GET :
      paths.GUEST_RESERVATION_GET
    ) + '/' + reservation.id)
  }

  render() {
    const { reservation, personal, mobileHeader } = this.props
    const from = moment(reservation.begins_at)
    const to = moment(reservation.ends_at)

    return (
      <div className={styles.reservationCard}>
        <div className={styles.title}>
          <div>
            {personal ?
              <div>{reservation.client && reservation.client.name}</div> :
              <div>{[ reservation.user.full_name, reservation.client && reservation.client.name ].filter(o => o).join(' / ')}</div>
            }
            <div>{reservation.place.floor.garage.name}</div>
          </div>

          {((reservation.client && reservation.client.is_secretary && to.isAfter(moment())) ||
            (mobileHeader.current_user && mobileHeader.current_user.id === reservation.user.id)) &&
            <div className={`${styles.gray} ${styles.icon}`} onClick={this.toReservation}><i className="icon-more" aria-hidden="true" /></div>
          }
        </div>

        <div className={styles.footer}>
          <div>
            <div>
              <div>{from.format('DD.MM.')}</div>
              <div>{from.format('HH:mm')}</div>
            </div>
            <div><i className="fa fa-angle-right" aria-hidden="true" /></div>
            <div>
              <div>{to.format('DD.MM.')}</div>
              <div>{to.format('HH:mm')}</div>
            </div>
          </div>

          <div>
            <div>
            {reservation.place.label}/{reservation.place.floor.label}
            </div>
            <div className={styles.gray}>{t([ 'mobileApp', 'reservation', 'place' ])}/{t([ 'mobileApp', 'reservation', 'floor' ])}</div>
          </div>
        </div>

        {mobileHeader.current_user && mobileHeader.current_user.id === reservation.user.id && // only current users reservations
        reservation.approved && // only approved reservations
        moment().isBetween(moment(reservation.begins_at), moment(reservation.ends_at)) &&
          <div className={styles.access}>
            {reservation.place.gates
              .filter(gate => gate.phone)
              .map(gate => <Swipe
                key={`${reservation.id}/${gate.id}`}
                label={gate.label}
                onSwipe={this.onSwipe(gate)}
                success={gate.success}
                error={gate.error}
              />)
            }
          </div>
        }
      </div>
    )
  }
}

export default withRouter(connect(
  state => ({ mobileHeader: state.mobileHeader }),
  dispatch => ({ actions: bindActionCreators(reservationActions, dispatch) })
)(ReservationCard))

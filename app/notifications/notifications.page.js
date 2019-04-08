import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { MOMENT_DATETIME_FORMAT } from '../_shared/helpers/time'

import PageBase         from '../_shared/containers/pageBase/PageBase'
import Table            from '../_shared/components/table/Table'
// import Form             from '../_shared/components/form/Form'
import RoundButton      from '../_shared/components/buttons/RoundButton'

import ReservationInfo from './notificationReservationInfo'

import { t }       from '../_shared/modules/localization/localization'

import styles from './notifications.page.scss'

import * as notificationsActions from '../_shared/actions/notifications.actions'

import { convertPriceToString } from '../_shared/helpers/calculatePrice'

class NotificationsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initNotifications()
  }

  makeReservation(reservationArray) {
    return {
      userName:   reservationArray[0],
      clientName: reservationArray[1],
      garageName: reservationArray[2],
      placeLabel: `${reservationArray[3]}/${reservationArray[4]}`,
      beginsAt:   moment(reservationArray[5]).format(MOMENT_DATETIME_FORMAT),
      endsAt:     moment(reservationArray[6]).format(MOMENT_DATETIME_FORMAT),
      price:      convertPriceToString(parseFloat(reservationArray[7], 10)),
      currency:   reservationArray[8],
      payedBy:    reservationArray[9]
    }
  }

  render() {
    const { state, actions } = this.props

    const schema = [
      {
        key:         'name',
        title:       t([ 'notifications', 'user' ]),
        comparator:  'string',
        representer: o => <strong>{o}</strong>
      },
      { key: 'email', title: t([ 'notifications', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'notifications', 'phone' ]), comparator: 'number' },
      {
        key:         'created_at',
        title:       t([ 'notifications', 'sent' ]),
        comparator:  'date',
        representer: o => (
          <span>
            {moment(o).format('ddd DD.MM.YYYY')}
            {' '}
            {moment(o).format('H:mm')}
          </span>
        ),
        sort: 'desc'
      }
    ]

    const data = state.notifications.map(notification => {
      const createSpoiler = () => {
        const returnMessage = () => {
          const parts = notification.message
            ? notification.message.split(';')
            : [ 'noMessage' ] // if no message comes
          const translation = t(
            [ 'notifications', parts[0] ],
            { arg1: parts[1] || '', arg2: parts[2] || '' }
          )

          let reservation
          if (parts[3] === 'reservation') {
            reservation = this.makeReservation(parts.slice(4))
          }

          // news are not ment to be translated.
          if (translation.includes('missing translation:')) {
            return parts[1]
              ? <a href={parts[1]}>{parts[0]}</a>
              : parts[0]
          } else {
            return (
              <div>
                <div>
                  {translation}
                </div>
                {reservation && (
                  <ReservationInfo reservation={reservation} />
                )}
              </div>
            )
          }
        }

        const confirm = () => actions.accept(notification)
        const decline = () => actions.decline(notification)

        return (
          <div>
            <span>{returnMessage()}</span>
            {' '}
            <br />
            {notification.custom_message && (
              <span>
                {notification.creator.full_name}
                {' '}
                {t([ 'notifications', 'sais' ])}
                {': '}
                {notification.custom_message}
              </span>
            )}
            {notification.custom_message && <br />}
            {!notification.confirmed && (
              <span className={styles.floatRight}>
                {notification.notification_type.indexOf('No') !== -1 && (
                  <RoundButton
                    content={<span className="fa fa-times" aria-hidden="true" />}
                    onClick={decline}
                    type="remove"
                    question={t([ 'notifications', 'declineQuestion' ])}
                  />
                )}
                {notification.notification_type.indexOf('Yes') !== -1 && (
                  <RoundButton
                    content={<span className="fa fa-check" aria-hidden="true" />}
                    onClick={confirm}
                    type="confirm"
                  />
                )}
              </span>
            )}
            {notification.confirmed && (
              <span>
                {notification.confirmed
                  ? t([ 'notifications', 'NotificationAccepted' ])
                  : t([ 'notifications', 'NotificationDeclined' ])}
                {moment(notification.updated_at).format('ddd DD.MM.YYYY HH:mm')}
              </span>
            )}
          </div>
        )
      }

      return {
        name:       notification.creator.full_name,
        email:      notification.creator.email,
        phone:      notification.creator.phone,
        created_at: notification.created_at,
        spoiler:    createSpoiler()
      }
    })

    return (
      <PageBase>
        <div>
          <Table schema={schema} data={data} />
        </div>
      </PageBase>
    )
  }
}


export default connect(
  state => ({ state: state.notifications }),
  dispatch => ({ actions: bindActionCreators(notificationsActions, dispatch) })
)(NotificationsPage)

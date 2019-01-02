import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import { MOMENT_DATETIME_FORMAT }      from '../_shared/helpers/time'

import PageBase         from '../_shared/containers/pageBase/PageBase'
import Table            from '../_shared/components/table/Table'
// import Form             from '../_shared/components/form/Form'
import RoundButton      from '../_shared/components/buttons/RoundButton'

import { t }       from '../_shared/modules/localization/localization'

import styles from './notifications.page.scss'

import * as notificationsActions from '../_shared/actions/notifications.actions'


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
      full_name:   reservationArray[0],
      client_name: reservationArray[1],
      garage_name: reservationArray[2],
      place:       `${reservationArray[3]}/${reservationArray[4]}`,
      begins_at:   moment(reservationArray[5]).format(MOMENT_DATETIME_FORMAT),
      ends_at:     moment(reservationArray[6]).format(MOMENT_DATETIME_FORMAT)
    }
  }

  render() {
    const { state, actions } = this.props

    const schema = [
      { key: 'name', title: t([ 'notifications', 'user' ]), comparator: 'string', representer: o => <strong>{o}</strong> },
      { key: 'email', title: t([ 'notifications', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'notifications', 'phone' ]), comparator: 'number' },
      { key: 'created_at', title: t([ 'notifications', 'sent' ]), comparator: 'date', representer: o => <span>{ moment(o).format('ddd DD.MM.YYYY')} {moment(o).format('H:mm')}</span>, sort: 'desc' }
    ]

    const data = state.notifications.map(notification => {
      const createSpoiler = () => {
        const returnMessage = () => {
          const parts = notification.message ? notification.message.split(';') : [ 'noMessage' ] // if no message comes
          const translation = t([ 'notifications', parts[0] ], { arg1: parts[1] || '', arg2: parts[2] || '' })

          const isReservation = parts[3] || undefined

          let reservationInfo
          if (isReservation === 'reservation') {
            const reservation = this.makeReservation(parts.slice(4))

            reservationInfo = (
              <table>
                <tr>
                  <td>
                    <div>{`Name: ${reservation.full_name}`}</div>
                  </td>
                  <td>
                    <div>{`Garage: ${reservation.garage_name}`}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>{`Client: ${reservation.client_name}`}</div>
                  </td>
                  <td>
                    <div>{`Place: ${reservation.place}`}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <tr>
                      <div>{`Begins at: ${reservation.begins_at}`}</div>
                    </tr>
                  </td>
                  <td>
                    <div>{`Ends at: ${reservation.ends_at}`}</div>
                  </td>
                </tr>
              </table>
            )
          }

          if (translation.includes('missing translation:')) { // news are not ment to be translated.
            return parts[1]
              ? <a href={parts[1]}>{parts[0]}</a>
              : parts[0]
          } else {
            return (
              <div>
                <div>
                  {translation}
                </div>
                {reservationInfo &&
                  <div>
                    {reservationInfo}
                  </div>
                }
              </div>
            )
          }
        }

        const confirm = () => actions.accept(notification)
        const decline = () => actions.decline(notification)

        return (<div>
          <span>{returnMessage()}</span> <br />
          {notification.custom_message && <span>{notification.creator.full_name} {t([ 'notifications', 'sais' ])}: {notification.custom_message}</span>}{notification.custom_message && <br />}
          {!notification.confirmed ?
            <span className={styles.floatRight}>
              {notification.notification_type.indexOf('No') !== -1 && <RoundButton
                content={<span className="fa fa-times" aria-hidden="true" />}
                onClick={decline}
                type="remove"
                question={t([ 'notifications', 'declineQuestion' ])}
              />}
              {notification.notification_type.indexOf('Yes') !== -1 && <RoundButton
                content={<span className="fa fa-check" aria-hidden="true" />}
                onClick={confirm}
                type="confirm"
              />}
            </span> :
            <span>
              {notification.confirmed ? t([ 'notifications', 'NotificationAccepted' ]) : t([ 'notifications', 'NotificationDeclined' ]) }
              {moment(notification.updated_at).format('ddd DD.MM.YYYY HH:mm')}
            </span>
          }
        </div>)
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

import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

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

  render() {
    const { state, actions } = this.props

    const schema = [
      { key: 'name', title: t([ 'notifications', 'user' ]), comparator: 'string', representer: o => <strong>{o}</strong> },
      { key: 'email', title: t([ 'notifications', 'email' ]), comparator: 'string' },
      { key: 'phone', title: t([ 'notifications', 'phone' ]), comparator: 'number' },
      { key: 'created_at', title: t([ 'notifications', 'sent' ]), comparator: 'date', representer: o => <span>{ moment(o).format('ddd DD.MM.YYYY')} {moment(o).format('H:mm')}</span>, sort: 'desc' }
    ]

    // const confirmClick = notification => {
    //   actions.accept(notification)
    // }

    // const destroyClick = notification => {
    //   actions.decline(notification)
    // }

    const data = state.notifications.map(notification => {
      const createSpoiler = () => {
        const returnMessage = () => {
          const parts = notification.message ? notification.message.split(';') : [ 'noMessage' ] // if no message comes
          return t([ 'notifications', parts[0] ], { arg1: parts[1] || '', arg2: parts[2] || '' })
        }

        const confirm = () => actions.accept(notification)
        const decline = () => actions.decline(notification)

        return (<div>
          <span>{returnMessage()}</span> <br />
          {notification.custom_message && <span>{notification.creator.full_name} {t([ 'notifications', 'sais' ])}: {notification.custom_message}</span>}{notification.custom_message && <br />}
          {!notification.confirmed ?
            // <Form
            //   onSubmit={confirm}
            //   onBack={notification.notification_type.indexOf('No') === -1 ? undefined : decline}
            //   submitable
            // >

            // </Form> :
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

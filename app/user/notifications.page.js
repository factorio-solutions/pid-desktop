import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase         from '../_shared/containers/pageBase/PageBase'
import Table            from '../_shared/components/table/Table'
import RoundButton      from '../_shared/components/buttons/RoundButton'
import TextButton       from '../_shared/components/buttons/TextButton'
import ButtonStack      from '../_shared/components/buttonStack/ButtonStack'
import CardViewLayout   from '../_shared/components/cardView/CardViewLayout'
import NotificationCard from '../_shared/components/cardView/NotificationCard'

import * as nav    from '../_shared/helpers/navigation'
import { t }       from '../_shared/modules/localization/localization'
import { request } from '../_shared/helpers/request'

import styles from './notifications.page.scss'

// import { initNotifications, accept, decline } from '../_shared/actions/notifications.actions'
import * as notificationsActions from '../_shared/actions/notifications.actions'


export class NotificationsPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount () {
    this.props.actions.initNotifications()
  }

  render() {
    const {state, actions} = this.props

    const schema = [ { key: 'name',       title: t(['notifications','user']),   comparator: 'string', representer: o => <strong>{o}</strong> }
                   , { key: 'email',      title: t(['notifications','email']),  comparator: 'string' }
                   , { key: 'phone',      title: t(['notifications','phone']),  comparator: 'number' }
                   , { key: 'created_at', title: t(['notifications','sent']),   comparator: 'date',   representer: o => <span>{ moment(o).format('ddd DD.MM.YYYY')} {moment(o).format('H:mm')}</span>, sort: 'desc' }
                   ]

     const confirmClick = (notification) => {
       actions.accept(notification)
     }

     const destroyClick = (notification) => {
       actions.decline(notification)
     }

    const data = state.notifications.map(function (notification){
      const createSpoiler = () => {
        const returnMessage = () => {
          const parts = notification.message.split(';')
          return t(['notifications',parts[0]], {arg1: parts[1] || "", arg2: parts[2] || ""})
        }

        return <div>
                  <span>{returnMessage()}</span> <br/>
                  {notification.custom_message && <span>{notification.creator.full_name} {t(['notifications','sais'])}: "{notification.custom_message}"</span>}{notification.custom_message && <br/>}
                  {/*}<span className={styles.expiration}>{t(['notifications','expiration'])} {moment(notification.expiration).format('ddd DD.MM.YYYY')}</span> */}
                  {notification.confirmed == undefined ?
                    <span className={styles.floatRight}>
                      {notification.notification_type.indexOf('No') != -1 && <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={() => {destroyClick(notification)}} type='remove' question={t(['notifications','declineQuestion'])} />}
                      {notification.notification_type.indexOf('Yes') != -1 && <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={() => {confirmClick(notification)}} type='confirm' />}
                    </span>
                    : <span> {notification.confirmed ?t(['notifications','NotificationAccepted']) : t(['notifications','NotificationDeclined']) } {moment(notification.updated_at).format('ddd DD.MM.YYYY HH:mm')}</span>
                  }
                </div>
      }

      return { name: notification.creator.full_name
             , email: notification.creator.email
             , phone: notification.creator.phone
             , created_at: notification.created_at
             , spoiler: createSpoiler()
             }
    })

    const prepareCards = (notification, index) => {
      const confirm = () => {confirmClick(notification)}
      const decline = () => {destroyClick(notification)}
      return <NotificationCard key={index} notification={notification} confirm={confirm} decline={decline}/>
    }

    const content = <div>
      {state.tableView ? <Table schema={schema} data={data} />
                       : <CardViewLayout columns={2}>
                           {state.notifications.map(prepareCards)}
                         </CardViewLayout>
      }
    </div>



    const filters= <div>
            <ButtonStack divider={<span>|</span>} style='horizontal' >
              <TextButton content={t(['notifications','past'])} onClick={() => {actions.setPast(true)}} state={state.past && 'selected'}/>
              <TextButton content={t(['notifications','current'])} onClick={() => {actions.setPast(false)}} state={!state.past && 'selected'}/>
            </ButtonStack>
            <ButtonStack divider={<span>|</span>} style='horizontal' >
              <TextButton content={t(['pageBase','cardView'])} onClick={() => {actions.setTableView(false)}} state={!state.tableView && 'selected'}/>
              <TextButton content={t(['pageBase','tableView'])} onClick={() => {actions.setTableView(true)}} state={state.tableView && 'selected'}/>
            </ButtonStack>
          </div>

    return (
      <PageBase content={content} filters={filters} />
    );
  }
}


export default connect(state => {
  const { notifications } = state
  return ({
    state: notifications
  })
}, dispatch => ({
  actions: bindActionCreators(notificationsActions, dispatch)
}))(NotificationsPage)
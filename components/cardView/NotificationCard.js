import React        from 'react'
import styles       from './Card.scss'
import moment       from 'moment'

import Card         from './Card'
import RoundButton  from '../buttons/RoundButton'

import { t }       from '../../modules/localization/localization'


// onClick and selected are expected to be set by CardViewLayout
export default function NotificationCard ({ notification, confirm, decline, state, onClick, selected })  {

  const returnMessage = () => {
    const parts = notification.message.split(';')
    return t(['notifications',parts[0]], {arg1: parts[1] || "", arg2: parts[2] || ""})
  }

  const message = <div>
    <span>{returnMessage()}</span> <br/>
    {notification.custom_message && <span>{notification.creator.full_name} {t(['notifications','sais'])}: "{notification.custom_message}"</span>}
    {notification.custom_message && <br/>}
  </div>

  const footer = <div className={styles.footerContainer}>
            <span className={styles.footerInfo}>
              {t(['notifications','created'])} {moment(notification.created_at).format('ddd DD.MM.YYYY HH:mm')} <br/>
              {notification.confirmed != undefined && (notification.confirmed ?t(['notifications','NotificationAccepted']) : t(['notifications','NotificationDeclined'])) } {notification.confirmed != undefined && moment(notification.updated_at).format('ddd DD.MM.YYYY HH:mm')}
            </span>
            {notification.confirmed == undefined &&
                <span className={styles.buttons}>
                  {notification.notification_type.indexOf('No') != -1 && <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={decline} type='remove' question={t(['notifications','declineQuestion'])} />}
                  {notification.notification_type.indexOf('Yes') != -1 && <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={confirm} type='confirm' />}
                </span>
            }
          </div>

  return (
    <Card
      header = {<strong>{notification.creator.full_name}</strong>}
      body = {message}
      footer = {footer}
      state = {state}

      onClick = {onClick}
      selected ={selected}
    />
  )
}

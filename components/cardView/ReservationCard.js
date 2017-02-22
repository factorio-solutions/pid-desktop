import React  from 'react'
import moment from 'moment'

import Card         from './Card'
import RoundButton  from '../buttons/RoundButton'

import { t } from '../../modules/localization/localization'

import styles from './Card.scss'


// onClick and selected are expected to be set by CardViewLayout
export default function ReservationCard ({ reservation, destroy, state, onClick, selected })  {
  const body =  <div>
                  {reservation.client && <div>{reservation.client.name}</div>}
                  <div>{reservation.place.floor.garage.name}</div>
                  <div className={`${styles.reservationBody} ${styles.timeContainter}`}>
                    <strong className={styles.from}>{ moment(reservation.begins_at).format('ddd DD.MM.')} <br/> {moment(reservation.begins_at).format('H:mm')}</strong>
                    <strong className={styles.to}>{ moment(reservation.ends_at).format('ddd DD.MM.')}<br/> {moment(reservation.ends_at).format('H:mm')}</strong>
                  </div>
                  <div className={`${styles.reservationBody} ${styles.big}`}>{reservation.place.floor.label} / {reservation.place.label}</div>
                </div>

  const footer =  <div className={styles.footerContainer}>
                    <span className={styles.footerInfo}>
                      {reservation.creator.full_name} <br/> {reservation.creator.email} <br/> {moment(reservation.created_at).format('DD.MM. HH:mm')}
                    </span>
                    <span className={styles.buttons}>
                      <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroy} type='remove' question={t(['reservations','removeReservationQuestion'])}/>
                    </span>
                  </div>

  return (
    <Card
      header = {<strong>{reservation.user.full_name}</strong>}
      body = {body}
      footer = {footer}
      state = {!reservation.approved && 'disabled'}

      onClick = {onClick}
      selected ={selected}
    />
  )
}

<<<<<<< HEAD
import React        from 'react'
import styles       from './Card.scss'
import moment       from 'moment'
=======
import React  from 'react'
import moment from 'moment'
>>>>>>> feature/new_api

import Card         from './Card'
import RoundButton  from '../buttons/RoundButton'

<<<<<<< HEAD
import { t }       from '../../modules/localization/localization'


// onClick and selected are expected to be set by CardViewLayout
export default function ReservationCard ({ reservation, destroy, state, onClick, selected })  {
  const body = <div>
    <div>{reservation.account.name} <br/> {reservation.place.floor.garage.name}</div>
    <div className={`${styles.reservationBody} ${styles.timeContainter}`}>
      <strong className={styles.from}>{ moment(reservation.begins_at).format('ddd DD.MM.')} <br/> {moment(reservation.begins_at).format('H:mm')}</strong>
      <strong className={styles.to}>{ moment(reservation.ends_at).format('ddd DD.MM.')} <br/> {moment(reservation.ends_at).format('H:mm')}</strong>
    </div>
    <div className={`${styles.reservationBody} ${styles.big}`}>{reservation.place.floor.label} / {reservation.place.label}</div>
  </div>

  const footer = <div className={styles.footerContainer}>
            <span className={styles.footerInfo}>
              {reservation.creator.full_name} <br/> {reservation.creator.email} <br/> {moment(reservation.created_at).format('DD.MM. HH:mm')}
            </span>
            <span className={styles.buttons}>
              <RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroy} type='remove' question={t(['reservations','removeReservationQuestion'])}/>
            </span>
          </div>
=======
import { t } from '../../modules/localization/localization'

import styles from './Card.scss'


// onClick and selected are expected to be set by CardViewLayout
export default function ReservationCard ({ reservation, download, destroy, state, onClick, selected })  {
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
                      {reservation.invoice_item && reservation.invoice_item.invoice && reservation.invoice_item.invoice.payed && <RoundButton content={<span className='fa fa-download' aria-hidden="true"></span>} onClick={()=>{download(reservation.invoice_item.invoice.id)}} type='action'/>}
                      {/*<RoundButton content={<span className='fa fa-times' aria-hidden="true"></span>} onClick={destroy} type='remove' question={t(['reservations','removeReservationQuestion'])}/>*/}
                    </span>
                  </div>
>>>>>>> feature/new_api

  return (
    <Card
      header = {<strong>{reservation.user.full_name}</strong>}
      body = {body}
      footer = {footer}
<<<<<<< HEAD
      state = {state}
=======
      state = {!reservation.approved && 'disabled'}
>>>>>>> feature/new_api

      onClick = {onClick}
      selected ={selected}
    />
  )
}

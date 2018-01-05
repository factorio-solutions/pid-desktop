import React  from 'react'
import moment from 'moment'

import { t }  from '../../modules/localization/localization'
import { formatDate } from './ReservationRow'

import styles from './ReservationRow.scss'


export default function GuestReservationRow({ reservation }) {
  return (
    <div>
      <div className={styles.guestTitle}>{reservation.user.full_name} / {reservation.car.licence_plate}</div>
      <div>{reservation.client.name}</div>
      <div>{reservation.place.floor.garage.name}</div>
      <table className={`${styles.table} ${reservation.approved === false && styles.disabled}`}>
        <tbody>
          <tr>
            <td>
              <div>
                {formatDate(reservation.begins_at)}
              </div>
              <div>
                {formatDate(reservation.ends_at)}
              </div>
            </td>
            <td>
              <div className={styles.place}>
                {reservation.place.floor.garage.flexiplace && moment(reservation.begins_at).isAfter(moment()) ?
                    t([ 'reservations', 'flexiblePlace' ]) :
                    `${reservation.place.floor.label} / ${reservation.place.label}`}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

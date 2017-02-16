import React  from 'react'
import styles from './ReservationRow.scss'
import moment from 'moment'


export default function ReservationRow ({ reservation })  {

  return(
    <table className={styles.table}>
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
              {reservation.place.floor.label} / {reservation.place.label}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}


export function formatDate( date ){
  return(
    <div>
      {moment(date).format("dd DD. MM.")}
      <span className={styles.reservationTime}>
        {moment(date).format("HH:mm")}
      </span>
    </div>
  )
}

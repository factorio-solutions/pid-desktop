import React from 'react'
import moment from 'moment'

import styles from './ReservationCard.scss'

export default function ReservationCard({ reservation, personal }) {
  return (
    <div className={styles.reservationCard}>
      <div className={styles.title}>
        <div>
          <div>John Doe / BMW XX</div>
          <div>Garaz Rustonka</div>
        </div>

        <div className={styles.gray}><i className="fa fa-pencil" aria-hidden="true" /></div>
      </div>

      <div className={styles.footer}>
        <div>
          <div>
            <div>24.05.</div>
            <div>06:00</div>
          </div>
          <div><i className="fa fa-angle-right" aria-hidden="true" /></div>
          <div>
            <div>24.05.</div>
            <div>18:00</div>
          </div>
        </div>

        <div>
          <div>P-1/41</div>
          <div className={styles.gray}>Podlaží/Místo</div>
        </div>
      </div>
    </div>
  )
}

import React    from 'react'
import styles   from './Timepicker.scss'
import { t } from '../../modules/localization/localization'


export default function Minutes({ time, onClick }) {
  const createMinutes = () => {
    const minutes = Array(4).fill().map((_, row) => row * 15)

    return minutes.map(minute => {
      return (<tr key={minute} className={`${styles.clickable} ${styles.pickerRow}`} onClick={() => { onClick(minute) }}>
        <td>
          <div className={parseInt(time.split(':')[1], 10) === minute && styles.selected}>{minute}</div>
        </td>
      </tr>)
    })
  }

  return (
    <div className={styles.minutesContainer}>
      <table className={styles.minuteTable}>
        <thead>
          <tr>
            <td>{t([ 'datetimepicker', 'minute' ])}</td>
          </tr>
        </thead>
        <tbody>
          {createMinutes()}
        </tbody>
      </table>
    </div>
  )
}

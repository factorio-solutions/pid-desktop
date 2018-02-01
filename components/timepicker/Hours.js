import React    from 'react'
import styles   from './Timepicker.scss'
import { t } from '../../modules/localization/localization'


export default function Hours({ time, onClick }) {
  const createHours = () => {
    const hours = Array(4).fill().map((_, row) => Array(6).fill().map((_, col) => (6 * row) + col))

    return hours.map((hoursRow, index) => {
      const createRow = hour => (<td key={hour} className={`${styles.clickable}`} onClick={() => onClick(hour)}>
        <div className={parseInt(time.split(':')[0], 10) === hour && styles.selected}>{hour}</div>
      </td>)

      return <tr key={index} className={styles.pickerRow}>{hoursRow.map(createRow)}</tr>
    })
  }

  return (
    <div className={styles.hoursContainer}>
      <table className={styles.hoursTable}>
        <thead>
          <tr>
            <td colSpan="6">{t([ 'datetimepicker', 'hour' ])}</td>
          </tr>
        </thead>
        <tbody>
          {createHours()}
        </tbody>
      </table>
    </div>
  )
}

import React    from 'react'
import moment   from 'moment'
import styles   from './Timepicker.scss'
import { t } from '../../modules/localization/localization'



export default function Hours ({ time, onClick }) {

  const createHours = () => {
    var hours = Array(4).fill().map(()=>Array(6).fill())
    for (var i = 0; i < 24; i++) {
      hours[Math.floor(i/6)][i%6] = i
    }

    return hours.map((hoursRow, index)=> {
       const createRow = (hour, index) => {
         return (
            <td
              key={index}
              className={`${styles.clickable}`}
              onClick={()=>{onClick(hour)}}>
              <div className={time.substring(0,2) == hour && styles.selected}>{hour}</div>
            </td>)
       }

      return (
        <tr key={index} className={styles.pickerRow}>{hoursRow.map(createRow)}</tr>
      )
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

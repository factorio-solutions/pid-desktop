import React    from 'react'
import moment   from 'moment'
import styles   from './Timepicker.scss'


export default function Minutes ({ time, onClick }) {
  const createMinutes = () => {
    const step = 15
    var i = 0
    var minutes = []
    do {
      minutes.push(i*step)
      i++
    } while (i*step < 60)

    return minutes.map((minute, index) => {

      return <tr key={index} className={`${styles.clickable} ${styles.pickerRow}`} onClick={()=>{onClick(minute)}}>
        <td>
          <div className={time.substring(3) == minute && styles.selected}>{minute}</div>
        </td>
      </tr>
    })
  }

  return (
        <div className={styles.minutesContainer}>
          <table className={styles.minuteTable}>
            <thead>
              <tr>
                <td>Minute</td>
              </tr>
            </thead>
            <tbody>
              {createMinutes()}
            </tbody>
          </table>
        </div>
      )
}

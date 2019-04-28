import React    from 'react'
import PropTypes from 'prop-types'
import styles   from './Timepicker.scss'
import { t } from '../../modules/localization/localization'


function Hours({ time, onClick }) {
  const createHours = () => {
    const hours = Array(4).fill().map((_, row) => Array(6).fill().map((_, col) => (6 * row) + col))

    return hours.map((hoursRow, index) => (
      <tr
        key={index}
        className={styles.pickerRow}
      >
        {hoursRow.map(hour => (
          <td key={hour} className={`${styles.clickable}`} onClick={() => onClick(hour)}>
            <div
              className={parseInt(time.split(':')[0], 10) === hour ? styles.selected : undefined}
            >
              {hour}
            </div>
          </td>
        ))}
      </tr>
    ))
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

Hours.propTypes = {
  time:    PropTypes.string,
  onClick: PropTypes.func
}

export default Hours

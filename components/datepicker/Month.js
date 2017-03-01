import React    from 'react'
import moment   from 'moment'
<<<<<<< HEAD
=======

>>>>>>> feature/new_api
import styles   from './Datepicker.scss'


export default function Month ({ date, leftClick, rightClick }) {
  return (
    <div className={styles.monthContainer}>
      <div className={styles.chevron} onClick={leftClick}><i className="fa fa-chevron-left" aria-hidden="true"></i></div>
      <div className={styles.month}> {moment(date).format('MMMM YYYY')} </div>
      <div className={styles.chevron} onClick={rightClick}><i className="fa fa-chevron-right" aria-hidden="true"></i></div>
    </div>
  )
}

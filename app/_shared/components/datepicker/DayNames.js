import React    from 'react'
import moment   from 'moment'
<<<<<<< HEAD
=======

>>>>>>> feature/new_api
import styles   from './Datepicker.scss'


export default function DayNames ()  {
<<<<<<< HEAD

  const createDayNames = function() {
    var days = Array.apply(null, {length: 7})
    days = days.map((day, index) => {
      // 2015-07-13 is monday - day 1
      return <td key={index} className={styles.dayName}> {moment(['2015','07',13+index].join('-')).format('ddd')} </td>
    })
    return days
  }

  return (
    <tr>{createDayNames()}</tr>
=======
  const createDayNames = (day, index) => { // 2015-07-13 is monday - day 1
    return <td key={index} className={styles.dayName}> {moment(['2015','07',13+index].join('-')).format('ddd')} </td>
  }

  return (
    <tr>{Array.apply(null, {length: 7}).map(createDayNames)}</tr>
>>>>>>> feature/new_api
  )
}

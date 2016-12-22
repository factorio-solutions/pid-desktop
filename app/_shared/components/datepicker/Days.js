import React    from 'react'
import moment   from 'moment'
import styles   from './Datepicker.scss'
import DayNames from './DayNames'


export default function Days ({ month, selected, onClick })  {

 const createWeeks = () => {
   const monthBegin =  moment(month).startOf('month')
   const monthEnd =  moment(month).endOf('month')
   var weeks = monthEnd.isoWeek() - monthBegin.isoWeek() + 1
   if(weeks < 0) weeks +=  monthBegin.weeksInYear() // correct year transition

   var days = Array(weeks).fill().map(()=>Array(7).fill()) // empty array, correct dimensions
   for (var i = 0; i < monthBegin.daysInMonth(); i++) {
     const date = [moment(monthBegin).format('YYYY'), moment(monthBegin).format('MM'), String((i+1)).length == 1 ? "0"+(i+1) : (i+1)].join('-')
     var dow = moment(date).isoWeekday() - 1
     var wom = moment(date).isoWeek() - monthBegin.isoWeek()
     if(wom < 0) wom +=  monthBegin.weeksInYear() // correct year transition

     days[wom][dow] = i+1
   }

   return days.map((week, index)=> {
      const createDays = (day, index) => {
        const thisDate = [moment(monthBegin).format('YYYY'), moment(monthBegin).format('MM'), String(day).length == 1 ? "0"+day : day].join('-')
        return (
          <td
            key={index}
            className={`${styles.clickable}`}
            onClick={()=>{day && onClick(thisDate)}}>
            <div className={`${moment().format('YYYY-MM-DD') == thisDate && styles.today} ${selected.format('YYYY-MM-DD') == thisDate && styles.selected}`}>{day}</div>
          </td>)
      }

     return (
       <tr key={index} className={styles.pickerRow}>{week.map(createDays)}</tr>
     )
   })
 }

  return (
    <table className={styles.daysTable}>
      <thead>
        <DayNames />
      </thead>
      <tbody>
        {createWeeks()}
      </tbody>
    </table>
  )
}

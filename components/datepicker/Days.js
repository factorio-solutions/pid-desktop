import React    from 'react'
import moment   from 'moment'

import DayNames from './DayNames'

import styles   from './Datepicker.scss'

// 16.5.2017 10:50
// Uncaught RangeError: Invalid array length
//     at createWeeks (eval at <anonymous> (bundle.js:4381), <anonymous>:41:16)
//     at Days (eval at <anonymous> (bundle.js:4381), <anonymous>:74:47)
//     at StatelessComponent.render (eval at <anonymous> (bundle.js:1765), <anonymous>:44:17)
//     at eval (eval at <anonymous> (bundle.js:1765), <anonymous>:796:21)
//     at measureLifeCyclePerf (eval at <anonymous> (bundle.js:1765), <anonymous>:75:12)
//     at ReactCompositeComponentWrapper._renderValidatedComponentWithoutOwnerOrContext (eval at <anonymous> (bundle.js:1765), <anonymous>:795:25)
//     at ReactCompositeComponentWrapper._renderValidatedComponent (eval at <anonymous> (bundle.js:1765), <anonymous>:822:32)
//     at ReactCompositeComponentWrapper._updateRenderedComponent (eval at <anonymous> (bundle.js:1765), <anonymous>:746:36)
//     at ReactCompositeComponentWrapper._performComponentUpdate (eval at <anonymous> (bundle.js:1765), <anonymous>:724:10)
//     at ReactCompositeComponentWrapper.updateComponent (eval at <anonymous> (bundle.js:1765), <anonymous>:645:12)

export default function Days({ month, selected, onClick }) {
  const createWeeks = () => {
    const monthBegin = moment(month).startOf('month')
    const monthEnd = moment(month).endOf('month')
    let weeks = monthEnd.isoWeek() - monthBegin.isoWeek() + 1
    if (weeks < 0) weeks += monthBegin.weeksInYear() // correct year transition

    const days = Array(weeks).fill().map(() => Array(7).fill()) // empty array, correct dimensions
    for (let i = 0; i < monthBegin.daysInMonth(); i++) {
      const date = [ moment(monthBegin).format('YYYY'), moment(monthBegin).format('MM'), String((i + 1)).length == 1 ? '0' + (i + 1) : (i + 1) ].join('-')
      const dow = moment(date).isoWeekday() - 1
      let wom = moment(date).isoWeek() - monthBegin.isoWeek()
      if (wom < 0) wom += monthBegin.weeksInYear() // correct year transition

      days[wom][dow] = i + 1
    }

    return days.map((week, index) => {
      const createDays = (day, index) => {
        const thisDate = [ moment(monthBegin).format('YYYY'), moment(monthBegin).format('MM'), String(day).length == 1 ? '0' + day : day ].join('-')
        return (
          <td
            key={index}
            className={`${styles.clickable}`}
            onClick={() => { day && onClick(thisDate) }}
          >
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

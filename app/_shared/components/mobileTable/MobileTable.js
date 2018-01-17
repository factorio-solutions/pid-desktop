import React  from 'react'
import styles from './MobileTable.scss'


export default function MobileTable({ content }) {
  // content = [{label: ... , row: object, onClick: function}]

  const prepareTableRows = (row, index) => {
    return (
      <tr key={index} onClick={row.onClick}>
        <td>
          <div>
            <div> {row.label} </div>
            <div> {row.row} </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          {content.map(prepareTableRows)}
        </tbody>
      </table>
    </div>
  )
}

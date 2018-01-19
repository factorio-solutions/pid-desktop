import React from 'react'

import styles from './TableRow.scss'


export default function HistoryTableRow({ schema, data, newData }) {
  const renderCell = (value, index) => {
    const hasNewValue = data[value.key] !== newData[value.key]

    return (<td key={index}>
      {hasNewValue && [
        <span>{(value.representer ? value.representer(newData[value.key]) : newData[value.key]) || '\u00A0'}</span>,
        <br />
      ]}
      <span className={hasNewValue && styles.removed}>{(value.representer ? value.representer(data[value.key]) : data[value.key]) || '\u00A0'}</span>
    </td>)
  }

  return (<tr className={`${styles.tr} ${styles.history}`}>
    {schema.map(renderCell)}
  </tr>)
}

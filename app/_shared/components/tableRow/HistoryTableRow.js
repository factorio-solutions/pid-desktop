import React from 'react'

import styles from './TableRow.scss'

// originalValue = true => will display all the old values - to show how was reservation created in first place
export default function HistoryTableRow({ schema, data, newData, originalValues }) {
  const renderCell = (value, index) => {
    const hasNewValue = !originalValues && data[value.key] !== newData[value.key]

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

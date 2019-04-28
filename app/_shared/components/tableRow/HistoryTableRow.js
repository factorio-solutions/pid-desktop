import React from 'react'
import PropTypes from 'prop-types'

import styles from './TableRow.scss'

// originalValue = true => will display all the old values - to show how was reservation created in first place
function HistoryTableRow({ schema, data, newData, originalValues }) {
  const renderCell = (value, index) => {
    const hasNewValue = !originalValues && data[value.key] !== newData[value.key]

    return (
      <td key={index}>
        {hasNewValue && [
          <span>
            {(value.representer
              ? value.representer(newData[value.key])
              : newData[value.key]) || '\u00A0'
            }
          </span>,
          <br />
        ]}
        <span className={hasNewValue ? styles.removed : undefined}>
          {
            (
              value.representer
                ? value.representer(data[value.key])
                : data[value.key]
            )
            || '\u00A0'
          }
        </span>
      </td>
    )
  }

  return (
    <tr className={`${styles.tr} ${styles.history}`}>
      {schema.map(renderCell)}
    </tr>
  )
}

HistoryTableRow.propTypes = {
  schema:         PropTypes.array,
  data:           PropTypes.object,
  newData:        PropTypes.object,
  originalValues: PropTypes.bool
}

export default HistoryTableRow

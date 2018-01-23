import React from 'react'

import styles from './TableRow.scss'


export default function TableRow({ schema, data, hover, onClick, className }) {
  return (
    <tr className={`${styles.tr} ${hover && styles.hover} ${className}`} onClick={onClick}>
      {schema.map((value, index) => <td key={index}>{(value.representer ? value.representer(data[value.key]) : data[value.key]) || '\u00A0'}</td>)}
    </tr>
  )
}

import React from 'react'

import styles from './Table.scss'


export default function EnumButton({ disabled, onClick, children }) {
  return (<span
    className={disabled && styles.disabled}
    onClick={onClick}
    role="button"
    tabIndex={0}
  >
    { children }
  </span>)
}

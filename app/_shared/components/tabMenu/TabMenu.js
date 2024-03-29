import React    from 'react'
import styles   from './TabMenu.scss'

// extends Button.js
// state = 'selected'

export default function TabButton({ left, right, style }) {
  return (
    <div className={`${styles.tabMenu} ${style}`}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>
  )
}


import React from 'react'
import styles from './IconWithCount.scss'

export default function IconWithCount({ icon, count, onClick, type }) {
  return (
    <div
      className={`${styles.messages} ${styles[type]}`}
      onClick={onClick}
    >
      <i
        className={icon}
        aria-hidden="true"
      />
      {count > 0 &&
        <div className={styles.count}>
          {count}
        </div>
      }
    </div>
  )
}

import React from 'react'

import styles from './Modal.scss'


export default function Modal ({ content, show })  {
  return (
    <div className={`${styles.dimmer} ${show ? '' : styles.hidden}`}>
      <div className={styles.modal}>
        {content}
      </div>
    </div>
  )
}

import React from 'react'

import styles from './Modal.scss'


export default function Modal ({ content, children, show, zindex }) {
  return (
    <div className={`${styles.dimmer} ${show ? '' : styles.hidden}`} style={{ zIndex: zindex }}>
      <div className={styles.modal}>
        {content || children}
      </div>
    </div>
  )
}

import React from 'react'

import RoundButton from '../buttons/RoundButton'

import styles from './Modal.scss'


export default function AlertModal({ question, onConfirm }) {
  return (
    <div>
      {question}
      <div className={styles.alertModalButtons}>
        <RoundButton content={<span className="fa fa-check" aria-hidden="true" />} onClick={onConfirm} type="confirm" />
      </div>
    </div>
  )
}

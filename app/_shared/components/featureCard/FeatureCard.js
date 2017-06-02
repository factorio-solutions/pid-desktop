import React from 'react'

import CallToActionButton from '../buttons/CallToActionButton'

import styles from './FeatureCard.scss'

// stat can be 'selected'

export default function FeatureCard ({ title, items=[], buttonLabel, onClick, state }) {
  const createLi = (item) => <li>{item}</li>

  return (
    <div className={styles.pricing} onClick={onClick}>
      <h3>{title}</h3>
      <ul className={styles.points}>
        {items.map(createLi)}
      </ul>
      <div className={styles.button}>
        <CallToActionButton onClick={onClick} label={buttonLabel} type="action" />
      </div>
    </div>
  )
}

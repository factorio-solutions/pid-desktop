import React    from 'react'

import styles   from './Card.scss'


export default function Card ({ header, body, footer, state, selected, onClick })  {

  return (
    <div className={`${styles.cardContainer} ${styles[state]}`} onClick={onClick}>
      <div className={`${styles.header} ${selected && styles.selected}`}>{ header }</div>
      <div className={`${styles.body}   ${selected && styles.border}`}>  { body }</div>
      <div className={`${styles.footer} ${!selected && styles.hidden}`}> { footer }</div>
    </div>
  )
}

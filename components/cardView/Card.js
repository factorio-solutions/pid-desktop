import React    from 'react'
<<<<<<< HEAD
=======

>>>>>>> feature/new_api
import styles   from './Card.scss'


export default function Card ({ header, body, footer, state, selected, onClick })  {

  return (
    <div className={`${styles.cardContainer} ${styles[state]}`} onClick={onClick}>
<<<<<<< HEAD
      <div className={`${styles.header} ${selected && styles.selected}`}>{header}</div>
      <div className={`${styles.body} ${selected && styles.border}`}>{body}</div>
      <div className={`${styles.footer} ${!selected && styles.hidden}`}>{footer}</div>
=======
      <div className={`${styles.header} ${selected && styles.selected}`}>{ header }</div>
      <div className={`${styles.body}   ${selected && styles.border}`}>  { body }</div>
      <div className={`${styles.footer} ${!selected && styles.hidden}`}> { footer }</div>
>>>>>>> feature/new_api
    </div>
  )
}

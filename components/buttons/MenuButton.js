import React    from 'react'
import styles   from './MenuButton.scss'
import Button   from './Button.js'

// extends Button.js
// type = 'action', 'confirm', 'remove'
// size = 'small', 'collapsed'
// state = 'selected', 'disabled'
// question = confirmation text for remove type button
<<<<<<< HEAD
=======


>>>>>>> feature/new_api
export default function MenuButton ({ icon, label, onClick, type, state, size, question, count })  {
  let style = [ styles.button
              , styles[type]
              , styles[state]
              , styles[size]
              , !icon && styles.adjustPadding
              ].join(' ')

  let content = <div>
<<<<<<< HEAD
                  <span className={`fa fa-${icon} ${styles.icon} ${styles.content}`} aria-hidden="true" ><span className={styles.count}>{count}</span></span>
                  <span className={`${styles.label} ${styles.content}`} >{label}</span>
=======
                  <span className={`fa fa-${icon} ${styles.icon} ${styles.content}`} aria-hidden="true"><span className={styles.count}>{count}</span></span>
                  <span className={`${styles.label} ${styles.content}`}>{label}</span>
>>>>>>> feature/new_api
                </div>

  return (
    <Button content={content} onClick={onClick} type={type} state={state} style={style} question={question}/>
  )
}

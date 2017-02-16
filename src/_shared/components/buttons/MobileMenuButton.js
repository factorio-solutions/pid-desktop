import React    from 'react'
import styles   from './MenuButton.scss'
import Button   from './Button.js'

// extends Button.js
// type = 'action', 'confirm', 'remove'
// size = 'collapsed'
// state = 'selected', 'disabled'
// question = confirmation text for remove type button


export default function MobileMenuButton ({ icon, label, onClick, type, state, size, question })  {
  let style = [ styles.button
              , styles[type]
              , styles[state]
              , !icon && styles.adjustPadding
              ].join(' ')

  let content = <div style={{height: (size-26)+"px", position: "relative"}}>
                  <div className={styles.centerInDiv}>
                    <span className={`fa fa-${icon} ${styles.icon} ${styles.content}`} aria-hidden="true"></span>
                    <span className={`${styles.label} ${styles.content}`}>{label}</span>
                  </div>
                </div>

  return (
    <Button content={content} onClick={onClick} type={type} state={state} style={style} question={question} />
  )
}

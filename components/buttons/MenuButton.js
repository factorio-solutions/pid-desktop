import React    from 'react'
import styles   from './MenuButton.scss'
import Button   from './Button.js'

// extends Button.js
// type = 'action', 'confirm', 'remove'
// state = 'selected', 'disabled'

export default function MenuButton ({ icon, label, onClick, type, state })  {
  let style = [ styles.button
              , styles[type]
              , styles[state]
              ].join(' ')

  let content = <div>
                  <i className={`fa fa-${icon} ${styles.icon}`} aria-hidden="true"></i>
                  <div className={`${styles.label}`}>{label}</div>
                </div>

  return (
    <Button content={content} onClick={onClick} type={type} state={state} style={style}/>
  )
}

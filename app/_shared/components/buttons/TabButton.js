import React    from 'react'
import styles   from './TabButton.scss'
import Button   from './Button.js'

// extends Button.js
// state = 'selected'

export default function TabButton ({ label, onClick, state })  {
  let style = [ styles.button
              , styles[state]
              ].join(' ')

  let content = <div className={`${styles.label}`}>{label}</div>

  return (
    <Button content={content} onClick={onClick} state={state} style={style}/>
  )
}
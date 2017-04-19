import React    from 'react'
import styles   from './CallToActionButton.scss'

import Button   from './Button.js'


// extends Button.js
// state = 'selected', 'disabled'


export default function CallToActionButton ({ label, onClick, state})  {
  let style = [ styles.button
              , styles[state]
              ].join(' ')

  let content = <span className={styles.label}>{label}</span>

  return (
    <Button content={content} onClick={onClick} state={state} style={style}/>
  )
}

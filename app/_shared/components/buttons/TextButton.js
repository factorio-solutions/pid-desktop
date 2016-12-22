import React    from 'react'
import styles   from './TextButton.scss'
import Button   from './Button.js'

// extends Button.js
// state = 'selected', 'disabled'
// question = text of confirm when button type is 'remove'
export default function TextButton ({ content, onClick, state, question })  {
  let style = [ styles.button
              , styles[state]
              ].join(' ')

  return (
    <Button content={content} onClick={onClick} state={state} style={style} question={question}/>
  )
}

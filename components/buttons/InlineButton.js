import React    from 'react'
import styles   from './InlineButton.scss'
import Button   from './Button.js'

// extends Button.js
// type = 'action', 'confirm', 'remove'
// state = 'selected', 'disabled'
// question = text of confirm when button type is 'remove'
<<<<<<< HEAD
export default function MenuButton ({ content, onClick, type, state, question })  {
=======


export default function MenuButton ({ content, onClick = ()=>{}, type, state, question })  {
>>>>>>> feature/new_api
  let style = [ styles.button
              , styles[type]
              , styles[state]
              ].join(' ')

  return (
    <Button content={content} onClick={onClick} type={type} state={state} style={style} question={question}/>
  )
}

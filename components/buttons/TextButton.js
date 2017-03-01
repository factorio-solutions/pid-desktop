import React    from 'react'
import styles   from './TextButton.scss'
import Button   from './Button.js'

// extends Button.js
// state = 'selected', 'disabled'
// question = text of confirm when button type is 'remove'
<<<<<<< HEAD
=======


>>>>>>> feature/new_api
export default function TextButton ({ content, onClick, state, question })  {
  let style = [ styles.button
              , styles[state]
              ].join(' ')

  return (
<<<<<<< HEAD
    <Button content={content} onClick={onClick} state={state} style={style} question={question}/>
=======
    <Button content={content} onClick={onClick} state={state} style={style} question={question} />
>>>>>>> feature/new_api
  )
}

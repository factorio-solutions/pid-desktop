import React    from 'react'
import styles   from './RoundButton.scss'
import Button   from './Button.js'

// extends Button.js
// type = undefined => default black, 'action' => blue, 'confirm' => green, 'remove' => red
// size ='big'
// question = confirmation text for remove type button


export default function RoundButton ({ content, onClick, type, state, size, question })  {
  let style = [ styles.button
              , styles[state]
              , styles[size]
              , !state && styles[type]
              ].join(' ')

  return (
    <Button content={content} onClick={onClick} type={type} state={state} style={style} question={question} />
  )
}

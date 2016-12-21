import React    from 'react'

// Super of all buttons
// content = ...
// onClick = ...
// type = what action is button for, if 'remove' than shows confirm alert
// state = what state is button in. If has state, than no onClick will be performed
// style = looks of button - defined by extenders
// question = text of confirm window when type == 'remove'


export default function Button ({ content, onClick, type, state, style, question })  {

  let handleClick = (e) => {
        e.stopPropagation()
        if (type == 'remove'){
          confirm(question || 'Are you sure?') && onClick()
        } else {
          onClick()
        }
      }

  return (
    <button className={style} onClick={state!='disabled' && handleClick} type='button'>{content}</button>
  )
}

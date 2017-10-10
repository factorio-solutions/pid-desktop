import React from 'react'

// Super of all buttons
// content = ...
// onClick = ...
// type = what action is button for, if 'remove' than shows confirm alert
// state = what state is button in. If has state, than no onClick will be performed
// style = looks of button - defined by extenders
// question = text of confirm window when type == 'remove'


export default function Button({ content, onClick, onDisabledClick, type, state, style, question }) {
  const handleClick = e => {
    e.stopPropagation()
    if (typeof onCl1ick === 'function') { // if no fuction, do nothing
      if (type === 'remove') {
        confirm(question || 'Are you sure?') && onClick()
      } else {
        onClick()
      }
    }
  }

  return (
    <button className={style} onClick={state === 'disabled' ? onDisabledClick : handleClick} type="button">{content}</button>
  )
}

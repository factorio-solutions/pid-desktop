import React from 'react'

import ButtonGroupButton from './ButtonGroupButton'

// buttons = [
//   { content: "A label",
//     onClick: () => {},
//     selected: true
//   },
//   ...
// ]

export default function ButtonGroup({ buttons }) {
  return (
    <span>
      {buttons.map(button => (<ButtonGroupButton
        content={button.content}
        onClick={button.onClick}
        state={button.selected && 'selected'}
      />))}
    </span>
  )
}

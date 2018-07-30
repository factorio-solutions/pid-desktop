import React, { PropTypes } from 'react'

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
      {buttons.map((button, index) => (<ButtonGroupButton
        {...button}
        key={index}
        state={button.selected && 'selected'}
      />))}
    </span>
  )
}

ButtonGroup.propTypes = {
  buttons: PropTypes
    .arrayOf(PropTypes.shape(
      { content:  PropTypes.string.isRequired,
        onClick:  PropTypes.func,
        selected: PropTypes.bool
      }
    ))
    .isRequired
}

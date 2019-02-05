import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { confirm } from '../../actions/pageBase.actions'

// Super of all buttons
// content = ...
// onClick = ...
// type = what action is button for, if 'remove' than shows confirm alert
// state = what state is button in. If has state, than no onClick will be performed
// style = looks of button - defined by extenders
// question = text of confirm window when type == 'remove'


function Button({
  content,
  onClick,
  onDisabledClick,
  type,
  state,
  style,
  question,
  confirm,
  onMouseDown,
  className
}) {
  const handleClick = e => {
    e.stopPropagation()
    onClick && (type === 'remove' && question !== 'No message'
      ? confirm(question || 'Are you sure?', onClick)
      : onClick()
    )
  }

  return (
    <button
      className={`${style} ${className}`}
      type="button"
      onClick={state === 'disabled'
        ? onDisabledClick
        : handleClick
      }
      onMouseDown={state !== 'disabled' && onMouseDown}
    >
      {content}
    </button>
  )
}

Button.propTypes = {
  content: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  onClick:         PropTypes.func,
  onDisabledClick: PropTypes.func,
  type:            PropTypes.string,
  state:           PropTypes.string,
  style:           PropTypes.string,
  question:        PropTypes.string,
  confirm:         PropTypes.func,
  onMouseDown:     PropTypes.func,
  className:       PropTypes.string
}

export default connect(
  null,
  { confirm }
)(Button)

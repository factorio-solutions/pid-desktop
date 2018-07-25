import React       from 'react'
import { connect } from 'react-redux'
import { confirm } from '../../actions/pageBase.actions'

// Super of all buttons
// content = ...
// onClick = ...
// type = what action is button for, if 'remove' than shows confirm alert
// state = what state is button in. If has state, than no onClick will be performed
// style = looks of button - defined by extenders
// question = text of confirm window when type == 'remove'


function Button({ content, onClick, onDisabledClick, type, state, style, question, confirm, onMouseDown }) {
  const handleClick = e => {
    e.stopPropagation()
    if (typeof onClick === 'function') { // if no fuction, do nothing
      if (type === 'remove' && question !== 'No message') {
        // confirm(question || 'Are you sure?') && onClick()
        confirm(question || 'Are you sure?', onClick)
      } else {
        onClick()
      }
    }
  }

  return (
    <button
      className={style}
      type="button"
      onClick={state === 'disabled' ? onDisabledClick : handleClick}
      onMouseDown={state !== 'disabled' && onMouseDown}
    >
      {content}
    </button>
  )
}

// class Button extends React.PureComponent {
//   static propTypes = {
//     content:         React.PropTypes.object,
//     onClick:         React.PropTypes.func,
//     onDisabledClick: React.PropTypes.func,
//     type:            React.PropTypes.string,
//     state:           React.PropTypes.string,
//     style:           React.PropTypes.string,
//     question:        React.PropTypes.string,
//     confirm:         React.PropTypes.func,
//     onMouseDown:     React.PropTypes.func
//   }

//   handleClick = e => {
//     const { onClick, type, question, confirm } = this.props
//     e.stopPropagation()
//     if (typeof onClick === 'function') { // if no fuction, do nothing
//       if (type === 'remove' && question !== 'No message') {
//         // confirm(question || 'Are you sure?') && onClick()
//         confirm(question || 'Are you sure?', onClick)
//       } else {
//         onClick()
//       }
//     }
//   }

//   render() {
//     const { content, state, style, onMouseDown, onDisabledClick } = this.props

//     return (
//       <button
//         className={style}
//         type="button"
//         onClick={state === 'disabled' ? onDisabledClick : this.handleClick}
//         onMouseDown={state !== 'disabled' && onMouseDown}
//       >
//         {content}
//       </button>
//     )
//   }
// }


export default connect(
  () => ({}),
  { confirm }
)(Button)

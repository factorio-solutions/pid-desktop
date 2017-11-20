import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './LabeledRoundButton.scss'
import RounButton from './RoundButton.js'

// extends RoundButton.js
// label = label to be displayed below the button


// export default function LabeledRoundButton ({ label, content, onClick, onDisabledClick, type, state, size, question })  {
//   return (
//     label ? <div className={styles.labeledRoundButton}>
//       <RounButton content={content} onClick={onClick} type={type} state={state} question={question} onDisabledClick={onDisabledClick}/>
//       <div>{label}</div>
//     </div>
//     : <RounButton content={content} onClick={onClick} type={type} state={state} question={question} onDisabledClick={onDisabledClick}/>
//   )
// }

class LabeledRoundButton extends Component {
  static propTypes = {
    hint:            PropTypes.object.isRequired,
    label:           PropTypes.string.isRequired,
    content:         PropTypes.object.isRequired,
    onClick:         PropTypes.func,
    onDisabledClick: PropTypes.func,
    type:            PropTypes.string,
    state:           PropTypes.string,
    question:        PropTypes.string
  }

  render() {
    const { label, hint, content, onClick, onDisabledClick, type, state, question } = this.props

    return (
      (label && hint) ? <div className={styles.labeledRoundButton}>
        <RounButton content={content} onClick={onClick} type={type} state={state} question={question} onDisabledClick={onDisabledClick} />
        <div>{label}</div>
      </div>
      : <RounButton content={content} onClick={onClick} type={type} state={state} question={question} onDisabledClick={onDisabledClick} />
    )
  }
}


export default connect(
  state => ({ hint: state.pageBase.current_user && state.pageBase.current_user.hint }),
  () => ({})
)(LabeledRoundButton)

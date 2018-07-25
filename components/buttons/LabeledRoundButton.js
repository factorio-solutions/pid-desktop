import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'

import RounButton from './RoundButton.js'

import styles from './LabeledRoundButton.scss'

// extends RoundButton.js
// label = label to be displayed below the button


function LabeledRoundButton({ label, hint, ...buttonProps }) {
  const button = <RounButton {...buttonProps} />

  return label && hint
    ? <div className={styles.labeledRoundButton}>
      { button }
      <div>{label}</div>
    </div>
    : button
}

LabeledRoundButton.propTypes = {
  hint:            PropTypes.object.isRequired,
  label:           PropTypes.string.isRequired,
  content:         PropTypes.object.isRequired,
  onClick:         PropTypes.func,
  onDisabledClick: PropTypes.func,
  type:            PropTypes.string,
  state:           PropTypes.string,
  question:        PropTypes.string
}

export default connect(
  state => ({ hint: state.pageBase.current_user && state.pageBase.current_user.hint })
)(LabeledRoundButton)

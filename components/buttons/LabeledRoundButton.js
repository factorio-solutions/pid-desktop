import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'

import RoundButton from './RoundButton.js'

import styles from './LabeledRoundButton.scss'
import { small, big, normal } from './RoundButton.scss'

// extends RoundButton.js
// label = label to be displayed below the button


function LabeledRoundButton({ label, hint, size, ...buttonProps }) {
  const allStyles = {
    ...styles,
    small,
    big,
    normal
  }
  return (
    <div className={`${size ? allStyles[size] : allStyles.normal} ${allStyles.labeledRoundButton}`}>
      <RoundButton {...buttonProps} size={size} />
      {label && hint &&
        <div>{label}</div>
      }
    </div>
  )
}

LabeledRoundButton.propTypes = {
  hint:            PropTypes.object.isRequired,
  label:           PropTypes.string.isRequired,
  content:         PropTypes.object.isRequired,
  onClick:         PropTypes.func,
  onDisabledClick: PropTypes.func,
  type:            PropTypes.string,
  state:           PropTypes.string,
  question:        PropTypes.string,
  size:            PropTypes.string
}

export default connect(
  state => ({ hint: state.pageBase.current_user && state.pageBase.current_user.hint })
)(LabeledRoundButton)

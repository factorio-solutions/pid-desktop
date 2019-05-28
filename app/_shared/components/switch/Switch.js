import React from 'react'
import PropTypes from 'prop-types'

import styles from './Switch.scss'

// on: true/false
// onClick: function

function Switch({ on, onClick, state }) {
  return (
    <button
      onClick={state !== 'disabled' ? onClick : undefined}
      className={`${styles.switchContainer} ${on ? styles.on : styles.off} ${styles[state]}`}
      type="button"
    >
      <div className={`${styles.switch} ${on ? styles.on : styles.off} ${styles[state]}`} />
    </button>
  )
}

Switch.propTypes = {
  on:      PropTypes.bool,
  onClick: PropTypes.func,
  state:   PropTypes.object
}

export default Switch

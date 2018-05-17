import React, { Component, PropTypes }  from 'react'

import Timepicker  from './Timepicker'
import RoundButton from '../buttons/RoundButton'

import styles      from './PopupTimepicker.scss'


export default class PopupTimepicker extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    okClick:  PropTypes.func,
    time:     PropTypes.string, // moment compatible format
    show:     PropTypes.bool,
    flip:     PropTypes.bool,
    showInf:  PropTypes.bool
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.container.focus()
    }
  }

  render() {
    const { onSelect, time, show, okClick, showInf, flip } = this.props

    return (
      <div
        className={`${styles.popup} ${show ? '' : styles.hidden}  ${flip && styles.flip}`}
        ref={div => { this.container = div }}
        onBlur={okClick}
        tabIndex={0}
      >
        <Timepicker onSelect={onSelect} time={time} showInf={showInf} />
        <div className={styles.buttonContainer}>
          <RoundButton content={<span className="fa fa-check" aria-hidden="true" />} onClick={okClick} type="confirm" />
        </div>
      </div>
    )
  }
}

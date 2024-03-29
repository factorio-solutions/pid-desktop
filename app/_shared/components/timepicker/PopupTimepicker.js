import PropTypes from 'prop-types'
import React, { Component } from 'react'

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
    showInf:  PropTypes.bool,
    gray:     PropTypes.bool
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.container.focus()
    }
  }

  render() {
    const {
      onSelect,
      time,
      show,
      okClick,
      showInf,
      flip,
      gray
    } = this.props

    return (
      <div
        className={`${gray ? styles.popupGray : styles.popup} ${show ? '' : styles.hidden}  ${flip && styles.flip}`}
        ref={div => { this.container = div }}
        tabIndex={0}
      >
        <Timepicker
          onSelect={onSelect}
          time={time}
          showInf={showInf}
        />
        <div className={styles.buttonContainer}>
          <RoundButton
            content={<span className="fa fa-check" aria-hidden="true" />}
            onClick={okClick}
            type="confirm"
          />
        </div>
      </div>
    )
  }
}

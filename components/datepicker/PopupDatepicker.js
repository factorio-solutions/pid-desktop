import React, { Component, PropTypes }  from 'react'

import Datepicker  from './Datepicker'
import RoundButton from '../buttons/RoundButton'

import styles      from './PopupDatepicker.scss'


export default class PopupDatepicker extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    okClick:  PropTypes.func,
    date:     PropTypes.string, // moment compatible format
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
      date,
      show,
      okClick,
      showInf,
      flip,
      gray
    } = this.props

    return (
      <div
        className={`${gray ? styles.grayPopup : styles.popup} ${show ? '' : styles.hidden}  ${flip && styles.flip}`}
        ref={div => { this.container = div }}
        onBlur={okClick}
        tabIndex={0}
      >
        <Datepicker
          onSelect={onSelect}
          date={date}
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

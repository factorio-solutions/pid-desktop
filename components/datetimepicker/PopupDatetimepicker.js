import React, { Component, PropTypes }  from 'react'
import ReactDOM                         from 'react-dom'
import moment                           from 'moment'

import Datetimepicker from './Datetimepicker'
import RoundButton    from '../buttons/RoundButton'

import styles         from './PopupDatetimepicker.scss'


export default class PopupDatetimepicker extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    okClick:  PropTypes.func,
    datetime: PropTypes.string, // moment compatible format
    show:     PropTypes.bool,
    flip:     PropTypes.bool // will apear to left side of page
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.container.focus()
    }
  }

  render() {
    const { onSelect, datetime, show, okClick, flip } = this.props

    return (
      <div
        className={`${styles.popup} ${show ? '' : styles.hidden} ${flip && styles.flip}`}
        ref={div => { this.container = div }}
        onBlur={okClick}
        tabIndex={0}
      >
        <Datetimepicker onSelect={onSelect} datetime={datetime} />
        <div className={styles.buttonContainer}>
          <RoundButton content={<span className="fa fa-check" aria-hidden="true" />} onClick={okClick} type="confirm" />
        </div>
      </div>
    )
  }
}

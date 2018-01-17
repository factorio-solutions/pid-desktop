import React, { Component, PropTypes } from 'react'
import moment from 'moment'

import { MOMENT_DATETIME_FORMAT } from '../../helpers/time'

import PopupDatetimepicker from '../datetimepicker/PopupDatetimepicker'

import styles from './Input.scss'


// this component has to know its state, so it can be passed to the value attribute of input
// this way scss can validate if input has something in it
export default class DatetimeInput extends Component {
  static propTypes = {
    label:       PropTypes.string.isRequired, // is the placeholder
    error:       PropTypes.string, // error message if patern not met
    placeholder: PropTypes.string,
    style:       PropTypes.string,
    onChange:    PropTypes.func, // use if you want to pass value to parent
    onEnter:     PropTypes.func, // called when enter pressed
    onBlur:      PropTypes.func, // called when enter pressed
    value:       PropTypes.string,
    inlineMenu:  PropTypes.object,
    editable:    PropTypes.bool // can be turned off
  }

  static defaultProps = {
    editable: true
  }

  constructor(props) { // just to handle two way databinding
    super(props)
    this.state = { message: props.value || '', focus: false }
  }

  componentWillReceiveProps(newProps) {
    newProps.value !== undefined && this.setState({ message: newProps.value })
  }

  render() {
    const { label, error, placeholder, onChange, onEnter, onBlur, inlineMenu, style, editable } = this.props

    const handleChange = event => {
      editable && this.setState({ ...this.state, message: event.target.value })
      // onChange && onChange(moment(event.target.value, MOMENT_DATETIME_FORMAT).format(MOMENT_DATETIME_FORMAT), moment(event.target.value, MOMENT_DATETIME_FORMAT).isValid())
      onChange && onChange(event.target.value, moment(event.target.value, MOMENT_DATETIME_FORMAT).isValid())
    }

    const handlePick = date => {
      this.setState({ ...this.state, message: moment(date).format(MOMENT_DATETIME_FORMAT) })
      onChange && onChange(moment(date).format(MOMENT_DATETIME_FORMAT), moment(date).isValid())
      onBlur && onBlur()
    }

    const preventEnter = function (event) {
      const key = (typeof event.which === 'number') ? event.which : event.keyCode
      if (key === 13) {
        event.preventDefault()
        typeof (onEnter) === 'function' && onEnter()
      }
    }

    const showDatepicker = () => {
      this.setState({ ...this.state, focus: true })
    }

    const hideDatepicker = () => {
      this.setState({ ...this.state, focus: false })
    }

    return (
      <div className={`${styles.customFormGroup} ${styles.center} ${style} ${!editable && styles.dimmer}`} >
        <input
          type={'text'} value={this.state.message} onChange={handleChange} placeholder={placeholder} onKeyPress={preventEnter.bind(this)} pattern="(\d{1,2}).(\d{1,2}).(\d{4}) (\d{1,2}):(\d{2})"
          onBlur={onBlur}
        />
        <span className={styles.bar} />
        <label className={styles.label}>{label}</label>
        <label className={`${styles.customFormGroup}  ${styles.inlineMenu}`}>{inlineMenu}</label>
        <label className={`${styles.customFormGroup}  ${styles.error}`} style={{ opacity: moment(this.state.message, MOMENT_DATETIME_FORMAT).isValid() ? 0 : 1 }}>{error}</label>
        <label className={`${styles.customFormGroup}  ${styles.callendar}`} onClick={editable && showDatepicker}><i className="fa fa-calendar" aria-hidden="true" /></label>
        <PopupDatetimepicker onSelect={handlePick} datetime={moment(this.state.message, [ 'YYYY-MM-DDTHH:mm', MOMENT_DATETIME_FORMAT ]).isValid() ? moment(this.state.message, MOMENT_DATETIME_FORMAT).format('YYYY-MM-DD HH:mm') : undefined} show={this.state.focus} okClick={hideDatepicker} />
      </div>
    )
  }
}

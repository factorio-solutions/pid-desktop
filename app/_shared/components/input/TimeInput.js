import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

import { MOMENT_DATETIME_FORMAT, MOMENT_TIME_FORMAT } from '../../helpers/time'

import PopupTimepicker from '../timepicker/PopupTimepicker'

import defaultStyles from './Input.scss'


// this component has to know its state, so it can be passed to \the value attribute of input
// this way scss can validate if input has something in it
export default class TimeInput extends Component {
  static propTypes = {
    label:       PropTypes.string.isRequired, // is the placeholder
    error:       PropTypes.string, // error message if patern not met
    placeholder: PropTypes.string,
    style:       PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    onChange:      PropTypes.func, // use if you want to pass value to parent
    onEnter:       PropTypes.func, // called when enter pressed
    onBlur:        PropTypes.func, // called when enter presseds
    value:         PropTypes.string,
    align:         PropTypes.string,
    inlineMenu:    PropTypes.object,
    editable:      PropTypes.bool, // can be turned off
    pickerOnFocus: PropTypes.bool
  }

  static defaultProps = {
    editable: true
  }

  constructor(props) { // just to handle two way databinding
    super(props)
    this.state = { message: props.value || '', focus: false }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillReceiveProps(newProps) {
    newProps.value !== undefined && this.setState({ message: newProps.value })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick = e => {
    if (this.container && !this.container.contains(e.target)) {
      this.hideDatepicker()
    }
  }

  timeToDate = time => `1.1.9999 ${time}` // will add some day to it, so moment can handle it

  handleChange = event => {
    const { editable, onChange } = this.props
    editable && this.setState({
      ...this.state,
      message: event.target.value
    })

    onChange && onChange(
      event.target.value,
      moment(event.target.value, MOMENT_TIME_FORMAT).isValid()
    )
  }

  handlePick = time => {
    const { onBlur, onChange } = this.props
    const date = this.timeToDate(time)
    const formatedDate = moment(date, MOMENT_DATETIME_FORMAT).format(MOMENT_TIME_FORMAT)

    this.setState({
      ...this.state,
      message: formatedDate
    })

    this.hideDatepicker()
    onChange && onChange(formatedDate, moment(date).isValid())
    onBlur && onBlur()
  }

  preventEnter = event => {
    const { onEnter } = this.props
    const key = (typeof event.which === 'number') ? event.which : event.keyCode
    if (key === 13) {
      event.preventDefault()
      typeof (onEnter) === 'function' && onEnter()
    }
  }

  showDatepicker = () => {
    this.setState({ ...this.state, focus: true })
  }

  hideDatepicker = () => {
    this.setState({ ...this.state, focus: false }, () => console.log('HideDatepicker. Focus: false.'))
  }

  handleFocus = event => {
    const { pickerOnFocus } = this.props

    if (!pickerOnFocus) return

    if (!this.state.focus) {
      this.showDatepicker()
      event.target.select()
    }
  }

  render() {
    const {
      label,
      error,
      placeholder,
      inlineMenu,
      style,
      editable,
      align,
      pickerOnFocus
    } = this.props

    const styles = typeof style === 'object' ? style : defaultStyles

    return (
      <div
        className={`${styles.customFormGroup} ${styles[align || 'center']} ${style} ${!editable && styles.dimmer}`}
        ref={div => this.container = div}
      >
        <input
          type={'text'}
          value={this.state.message}
          onChange={this.handleChange}
          placeholder={placeholder}
          onKeyPress={this.preventEnter}
          pattern="(\d{1,2}):(\d{2})"
          onFocus={this.handleFocus}
        />
        <span className={styles.bar} />

        <label
          className={styles.label}
        >
          {label}
        </label>

        <label
          className={`${styles.customFormGroup}  ${styles.inlineMenu}`}
        >
          {inlineMenu}
        </label>

        <label
          className={`${styles.customFormGroup}  ${styles.error}`}
          style={{ opacity: moment(this.state.message, MOMENT_TIME_FORMAT).isValid() ? 0 : 1 }}
        >
          {error}
        </label>

        {
          !pickerOnFocus &&
            <label
              className={`${styles.customFormGroup}  ${styles.callendar}`}
              onClick={editable && this.showDatepicker}
            >
              <i className="fa fa-clock-o" aria-hidden="true" />
            </label>
        }
        <PopupTimepicker
          onSelect={this.handlePick}
          time={
            moment(this.timeToDate(this.state.message), [ 'YYYY-MM-DDTHH:mm', MOMENT_DATETIME_FORMAT ]).isValid() ?
              moment(this.timeToDate(this.state.message), MOMENT_DATETIME_FORMAT).format('HH:mm') :
              undefined
          }
          show={this.state.focus}
          okClick={this.hideDatepicker}
          gray={style === 'gray'}
        />
      </div>
    )
  }
}

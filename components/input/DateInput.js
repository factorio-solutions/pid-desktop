import React, { Component, PropTypes } from 'react'
import moment                          from 'moment'

import PopupDatepicker from '../datepicker/PopupDatepicker'

import defaultStyles from './Input.scss'


export default class DateInput extends Component {
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
    value:         PropTypes.string,
    inlineMenu:    PropTypes.object,
    showInf:       PropTypes.bool,
    flip:          PropTypes.bool,
    editable:      PropTypes.bool,
    onBlur:        PropTypes.func,
    pickerOnFocus: PropTypes.bool
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

  handleChange = event => {
    const { editable } = this.props
    if (editable) {
      this.setState({ ...this.state, message: event.target.value })
    }
  }

  handlePick = date => {
    const { onChange, onBlur } = this.props
    const convertedDate = date === '' ? '' : moment(date).format('DD.MM.YYYY')

    this.setState({
      ...this.state,
      message: convertedDate
    })

    if (typeof onChange === 'function') {
      onChange(convertedDate, moment(date).isValid())
    }

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
    this.setState({ ...this.state, focus: false })
  }

  handleInputFocus = event => {
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
      showInf,
      flip,
      editable,
      onBlur,
      pickerOnFocus
    } = this.props

    const styles = typeof style === 'object' ? style : defaultStyles

    const messageIsValidDate = moment(this.state.message, 'DD.MM.YYYY').isValid()

    const errorStyle = {
      opacity: this.state.message === undefined ||
               this.state.message === '' ||
               messageIsValidDate ?
                 0 :
                 1
    }

    return (
      <div className={`${styles.customFormGroup} ${styles.center} ${style} ${!editable && styles.dimmer}`} >
        <input
          type={'text'}
          value={this.state.message}
          onChange={this.handleChange}
          placeholder={placeholder}
          onKeyPress={this.preventEnter}
          pattern="(\d{1,2}).(\d{1,2}).(\d{4})"
          onFocus={this.handleInputFocus}
          onBlur={onBlur}
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
          style={errorStyle}
        >
          {error}
        </label>
        {
          !pickerOnFocus &&
            <label
              className={`${styles.customFormGroup}  ${styles.callendar}`}
              onClick={this.showDatepicker}
            >
              <i
                className="fa fa-calendar"
                aria-hidden="true"
              />
            </label>
        }

        <PopupDatepicker
          showInf={showInf}
          onSelect={this.handlePick}
          date={messageIsValidDate ?
            moment(this.state.message, 'DD.MM.YYYY').format('YYYY-MM-DD') :
            undefined
          }
          show={this.state.focus}
          flip={flip}
          okClick={this.hideDatepicker}
          gray={style === 'gray'}
        />
      </div>
    )
  }
}

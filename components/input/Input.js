import React, { Component, PropTypes } from 'react'
import styles                          from './Input.scss'

// this component has to know its state, so it can be passed to the value attribute of input
// this way scss can validate if input has something in it
export default class Input extends Component {
  static propTypes = {
    label:        PropTypes.string.isRequired, // is the placeholder
    name:         PropTypes.string, // is name for the form
    type:         PropTypes.string, // can specify input type
    pattern:      PropTypes.string, // if type not specified can input regex pattern
    error:        PropTypes.string, // error message if patern not met
    autocomplete: PropTypes.string,
    placeholder:  PropTypes.string,
    accept:       PropTypes.string, // for file selector - file extention (expample '.pub')
    required:     PropTypes.bool,
    readOnly:     PropTypes.bool,
    align:        PropTypes.string, // can be center or
    onChange:     PropTypes.func, // use if you want to pass value to parent
    onBlur:       PropTypes.func,
    onEnter:      PropTypes.func, // called when enter pressed
    onFocus:      PropTypes.func, // called when enter pressed
    value:        PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    inlineMenu: PropTypes.object,
    style:      PropTypes.string,
    min:        PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    step: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    highlight: PropTypes.bool,
    isValid:   PropTypes.func
  }

  constructor(props) { // just to handle two way databinding
    super(props)
    this.state = { message: props.value || '' }
  }

  componentWillReceiveProps(newProps) {
    newProps.value !== undefined && this.setState({ message: newProps.value })
  }

  render() {
    const { label, name, type, error, pattern, autocomplete, placeholder, accept, align, onChange, onBlur, onEnter, onFocus, inlineMenu, style, min, step, highlight, readOnly, required, isValid } = this.props
    const message = this.state.message

    const handleChange = event => {
      if (type === 'file') {
        this.setState({ message: event.target.value })

        if (typeof onChange === 'function') {
          const reader = new FileReader()
          reader.onload = (() => event => onChange(event.target.result, true))(event.target.files[0])
          reader.readAsText(event.target.files[0])
        }
      } else {
        this.setState({ message: event.target.value })
        if (typeof onChange === 'function') {
          if (typeof isValid === 'function') {
            isValid(event.target.value)
          }
          onChange(event.target.value, event.target.checkValidity() && event.target.value !== '')
        }
      }
    }

    const preventEnter = event => {
      const key = (typeof event.which === 'number') ? event.which : event.keyCode
      if (key === 13) {
        event.preventDefault()
        typeof (onEnter) === 'function' && onEnter()
      }
    }
    // onKeyPress={preventEnter} // <- to input

    const isEmpty = () => this.input ? this.input.value === '' : true

    return (
      <div className={`${styles.customFormGroup} ${styles[align || 'left']} ${styles[style]} ${highlight && isEmpty() && styles.highlighted} ${readOnly && styles.dimmer}`} >
        <input
          onBlur={onBlur}
          onFocus={onFocus}
          pattern={pattern}
          type={type || 'text'}
          name={name}
          value={message || ''}
          onChange={handleChange}
          autoComplete={autocomplete}
          placeholder={placeholder}
          min={min}
          step={step}
          onKeyPress={preventEnter}
          ref={input => { this.input = input }}
          accept={accept}
          readOnly={readOnly}
          required={required}
        />
        <span className={styles.bar} />
        <label className={styles.label}>{label}</label>
        <label className={`${styles.customFormGroup}  ${styles.inlineMenu}`}>{inlineMenu}</label>
        <label className={`${styles.customFormGroup}  ${styles.error}`}>
          {error + ' '}
        </label>
      </div>
    )
  }
}

import React, { Component, PropTypes } from 'react'
import styles                          from './Input.scss'


// this component has to know its state, so it can be passed to the value attribute of input
// this way scss can validate if input has something in it
export default class PatternInput extends Component {
  static propTypes = {
    label:          PropTypes.string.isRequired, // is the placeholder
    pattern:        PropTypes.string, // if type not specified can input regex pattern
    error:          PropTypes.string, // error message if patern not met
    placeholder:    PropTypes.string,
    onChange:       PropTypes.func, // use if you want to pass value to parent
    onEnter:        PropTypes.func, // called when enter pressed
    value:          PropTypes.string,
    type:           PropTypes.string,
    align:          PropTypes.string,
    inlineMenu:     PropTypes.object,
    highlight:      PropTypes.bool,
    readOnly:       PropTypes.bool,
    normalizeInput: PropTypes.func
  }

  constructor(props) { // just to handle two way databinding
    super(props)
    this.state = { message: props.value || '' }
  }

  componentWillReceiveProps(nextProps) {
    nextProps.value !== this.state.message && this.setState({ message: nextProps.value })
  }

  handleChange = event => {
    const { onChange, normalizeInput } = this.props
    const { target } = event

    if (typeof normalizeInput === 'function') {
      let caretPosition = target.selectionStart
      const originalInputLength = target.value.length
      target.value = normalizeInput(this.input.value)
      caretPosition -= originalInputLength - target.value.length
      target.setSelectionRange(caretPosition, caretPosition)
    }

    this.setState({ message: target.value })

    if (typeof onChange === 'function') {
      onChange(target.value, target.checkValidity() && target.value !== '')
    }
  }

  preventEnter = event => {
    const key = (typeof event.which === 'number') ? event.which : event.keyCode
    if (key === 13) {
      event.preventDefault()
      typeof (onEnter) === 'function' && this.props.onEnter()
    }
  }

  render() {
    const { label, error, pattern, placeholder, inlineMenu, type, highlight, readOnly, align } = this.props


    const isEmpty = () => this.input ? this.input.value === '' : true

    return (
      <div className={`${styles.customFormGroup} ${styles[align || 'center']} ${highlight && isEmpty() && styles.highlighted} ${readOnly && styles.dimmer}`} >
        <input
          pattern={pattern}
          type={type || 'text'}
          value={this.state.message}
          onChange={this.handleChange}
          placeholder={placeholder}
          onKeyPress={this.preventEnter}
          ref={input => { this.input = input }}
          readOnly={readOnly}
        />
        <span className={styles.bar} />
        <label className={styles.label}>{label}</label>
        <label className={`${styles.customFormGroup}  ${styles.inlineMenu}`}>{inlineMenu}</label>
        <label className={`${styles.customFormGroup}  ${styles.error}`}>
          {error}
        </label>
      </div>
    )
  }
}

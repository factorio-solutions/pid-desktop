import React, { Component, PropTypes } from 'react'
import defaultStyles                   from './TextArea.scss'

// this component has to know its state, so it can be passed to the value attribute of input
// this way scss can validate if input has something in it
export default class TextArea extends Component {
  static propTypes = {
    label:       PropTypes.string.isRequired, // is the placeholder
    name:        PropTypes.string, // is name for the form
    pattern:     PropTypes.string, // if type not specified can input regex pattern
    placeholder: PropTypes.string,
    readOnly:    PropTypes.bool,
    align:       PropTypes.string, // can be center or
    onChange:    PropTypes.func, // use if you want to pass value to parent
    onBlur:      PropTypes.func,
    onFocus:     PropTypes.func, // called when enter pressed
    value:       PropTypes.string,
    style: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    highlight: PropTypes.bool
  }

  constructor(props) { // just to handle two way databinding
    super(props)
    this.state = { message: props.value || '' }
  }

  componentWillReceiveProps(newProps) {
    newProps.value !== undefined && this.setState({ message: newProps.value })
  }

  onChange = event => {
    this.props.onChange(event.target.value)
  }

  render() {
    const {
      label,
      name,
      pattern,
      placeholder,
      align,
      onBlur,
      onFocus,
      style,
      highlight,
      readOnly,
      value
    } = this.props
    const styles = style && typeof style !== 'string' ? style : defaultStyles

    const isEmpty = () => this.input ? this.input.value === '' : true

    return (
      <div className={`${styles.textAreaContainer} ${styles[align || 'left']} ${styles[style]} ${highlight && isEmpty() && styles.highlighted} ${readOnly && styles.dimmer}`} >
        <label>{label}</label>
        <textarea
          onBlur={onBlur}
          onFocus={onFocus}
          pattern={pattern}
          name={name}
          onChange={this.onChange}
          placeholder={placeholder}
          ref={input => { this.input = input }}
          readOnly={readOnly}
          value={value}
        />
        <span className={styles.bar} />
      </div>
    )
  }
}

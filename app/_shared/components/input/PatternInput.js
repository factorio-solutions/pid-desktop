import React, { Component, PropTypes } from 'react'
import ReactDOM                        from 'react-dom'
import styles                          from './Input.scss'


// this component has to know its state, so it can be passed to the value attribute of input
// this way scss can validate if input has something in it
export default class PatternInput extends Component {
  static propTypes = {
    label:        PropTypes.string.isRequired, // is the placeholder
    pattern:      PropTypes.string, // if type not specified can input regex pattern
    error:        PropTypes.string, // error message if patern not met
    placeholder:  PropTypes.string,
    onChange:     PropTypes.func, // use if you want to pass value to parent
    onEnter:      PropTypes.func, // called when enter pressed
    value:        PropTypes.string,
    type:         PropTypes.string,
    inlineMenu:   PropTypes.object
  }

  constructor(props) { // just to handle two way databinding
     super(props);
     this.state = { message: props.value || '' }
  }

  componentWillReceiveProps(nextProps) {
    nextProps.value != this.state.message && this.setState({ message: nextProps.value })
  }

  render(){
    const { label, error, pattern, placeholder, onChange, onEnter, inlineMenu, type } = this.props

    const handleChange = (event) => {
      this.setState({message: event.target.value});
      if (typeof onChange === "function") {
        onChange(event.target.value, event.target.checkValidity()&&event.target.value!="")
      }
    }

    const preventEnter = function(event){
      const key = (typeof event.which == "number") ? event.which : event.keyCode
      if (key == 13){
        event.preventDefault()
        typeof (onEnter) == "function" && onEnter()
      }
    }

    return(
      <div className={`${styles.customFormGroup} ${styles.center}`} >
        <input pattern={pattern} type={type?type:'text'} value={this.state.message} onChange={handleChange} placeholder={placeholder} onKeyPress={preventEnter.bind(this)}/>
        <span className={styles.bar}></span>
        <label className={styles.label}>{label}</label>
        <label className={`${styles.customFormGroup}  ${styles.inlineMenu}`}>{inlineMenu}</label>
        <label className={`${styles.customFormGroup}  ${styles.error}`}>
          {error}
        </label>
      </div>
    )
  }
}
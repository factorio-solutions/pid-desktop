import React, { Component, PropTypes } from 'react'
import ReactDOM                        from 'react-dom'
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
    value:        PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                  ]),
    inlineMenu:   PropTypes.object,
    style:        PropTypes.string,
    min:          PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                  ]),
    step:         PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                  ]),
    highlight:    PropTypes.bool
  }

  constructor(props) { // just to handle two way databinding
     super(props);
     this.state = { message: props.value || '' }
  }

  // componentDidMount(){
  //   const { required, readOnly } = this.props
  //   if (required) {
  //     ReactDOM.findDOMNode(this).children[0].required = true
  //   }
  //   if (readOnly){
  //     ReactDOM.findDOMNode(this).children[0].readOnly = true
  //   }
  // }

  componentWillReceiveProps (newProps) {
    newProps.value != undefined && this.setState({message: newProps.value});
    // const { onChange } = this.props
    // if (this.props.value != newProps.value){
    //   this.setState({message: newProps.value});
    //   if (typeof onChange === "function") {
    //     onChange(newProps.value, true)
    //   }
    // }
  }

  render(){
    const { label, name, type, error, pattern, autocomplete, placeholder, accept, align, onChange, onBlur, onEnter, inlineMenu, style, min, step, highlight, readOnly, required } = this.props
    var message = this.state.message;

    const handleChange = (event) => {
      if (type=='file') {
        this.setState({message: event.target.value});

        if (typeof onChange === "function") {
          var reader = new FileReader()
          reader.onload = ((theFile) => {
            var target = event.target
            return function(event) {
              onChange(event.target.result, true)
            };
          })(event.target.files[0]);
          reader.readAsText(event.target.files[0])

        }
      } else {
        this.setState({message: event.target.value});
        if (typeof onChange === "function") {
          onChange(event.target.value, event.target.checkValidity()&&event.target.value!="")
        }
      }
    }

    const preventEnter = function(event){
      const key = (typeof event.which == "number") ? event.which : event.keyCode
      if (key == 13){
        event.preventDefault()
        typeof (onEnter) == "function" && onEnter()
      }
    }
    //onKeyPress={preventEnter} // <- to input

    const isEmpty = () => { return this.refs.input ? this.refs.input.value==='' : true }

    return(
      <div className={`${styles.customFormGroup} ${styles[align?align:'left']} ${style} ${highlight && isEmpty() && styles.highlighted} ${readOnly && styles.dimmer}`} >
        <input onBlur={onBlur} pattern={pattern} type={type?type:'text'} name={name} value={message} onChange={handleChange}
          autoComplete={autocomplete} placeholder={placeholder} min={min} step={step} onKeyPress={preventEnter} ref='input' accept={accept}
          readOnly={readOnly} required={required}
        />
        <span className={styles.bar}></span>
        <label className={styles.label}>{label}</label>
        <label className={`${styles.customFormGroup}  ${styles.inlineMenu}`}>{inlineMenu}</label>
        <label className={`${styles.customFormGroup}  ${styles.error}`}>
          {error+' '}
        </label>
      </div>
    )
  }
}

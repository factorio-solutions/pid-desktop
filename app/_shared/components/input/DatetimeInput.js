import React, { Component, PropTypes } from 'react'
import ReactDOM                        from 'react-dom'
import styles                          from './Input.scss'
import moment                          from 'moment'

import PopupDatetimepicker from '../datetimepicker/PopupDatetimepicker'


// this component has to know its state, so it can be passed to the value attribute of input
// this way scss can validate if input has something in it
export default class DatetimeInput extends Component {
  static propTypes = {
    label:        PropTypes.string.isRequired, // is the placeholder
    error:        PropTypes.string, // error message if patern not met
    placeholder:  PropTypes.string,
    style:        PropTypes.string,
    onChange:     PropTypes.func, // use if you want to pass value to parent
    onEnter:      PropTypes.func, // called when enter pressed
    value:        PropTypes.string,
    inlineMenu:   PropTypes.object
  }

  constructor(props) { // just to handle two way databinding
     super(props);
     this.state = { message: props.value || '', focus: false }
  }

  componentWillReceiveProps (newProps) {
    newProps.value != undefined && this.setState({message: newProps.value});
  }

  render(){
    const { label, error, pattern, placeholder, onChange, onEnter, inlineMenu, type, style } = this.props

    const handleChange = (event) => {
      this.setState({... this.state, message: event.target.value});
      // if (typeof onChange === "function") {
      //   onChange(event.target.value, event.target.checkValidity()&&event.target.value!=""&&moment(event.target.value, 'DD.MM.YYYY HH:mm').isValid())
      // }
    }

    const onBlur = () => {
      if (typeof onChange === "function") {
        onChange(this.state.message, moment(this.state.message, 'DD.MM.YYYY HH:mm').isValid())
      }
    }

    const handlePick = (date) => {
      this.setState({... this.state, message: moment(date).format('DD.MM.YYYY HH:mm')});
      if (typeof onChange === "function") {
        onChange(moment(date).format('DD.MM.YYYY HH:mm'), moment(date).isValid())
      }
    }

    const preventEnter = function(event){
      const key = (typeof event.which == "number") ? event.which : event.keyCode
      if (key == 13){
        event.preventDefault()
        typeof (onEnter) == "function" && onEnter()
      }
    }

    const showDatepicker = () => {
      this.setState({...this.state, focus: true})
    }

    const hideDatepicker = () => {
      this.setState({...this.state, focus: false})
    }

    return(
      <div className={`${styles.customFormGroup} ${styles.center} ${style}`} onBlur={onBlur} >
        <input type={'text'} value={this.state.message} onChange={handleChange} placeholder={placeholder} onKeyPress={preventEnter.bind(this)} pattern="(\d{1,2}).(\d{1,2}).(\d{4}) (\d{1,2}):(\d{2})"/>
        <span className={styles.bar}></span>
        <label className={styles.label}>{label}</label>
        <label className={`${styles.customFormGroup}  ${styles.inlineMenu}`}>{inlineMenu}</label>
        <label className={`${styles.customFormGroup}  ${styles.error}`} style={{opacity: moment(this.state.message, 'DD.MM.YYYY HH:mm').isValid()? 0 : 1}}>{error}</label>
        <label  className={`${styles.customFormGroup}  ${styles.callendar}`} onClick={showDatepicker}><i className="fa fa-calendar" aria-hidden="true"></i></label>
        <PopupDatetimepicker onSelect={handlePick} datetime={moment(this.state.message, ['YYYY-MM-DDTHH:mm', 'DD.MM.YYYY HH:mm']).isValid() ? moment(this.state.message, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm') : undefined} show={this.state.focus} okClick={hideDatepicker}/>
      </div>
    )
  }
}

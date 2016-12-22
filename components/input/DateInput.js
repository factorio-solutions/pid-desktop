import React, { Component, PropTypes } from 'react'
import styles                          from './Input.scss'
import moment                          from 'moment'

import PopupDatepicker from '../datepicker/PopupDatepicker'


export default class DatetimeInput extends Component {
  static propTypes = {
    label:        PropTypes.string.isRequired, // is the placeholder
    error:        PropTypes.string, // error message if patern not met
    placeholder:  PropTypes.string,
    style:        PropTypes.string,
    onChange:     PropTypes.func, // use if you want to pass value to parent
    onEnter:      PropTypes.func, // called when enter pressed
    value:        PropTypes.string,
    inlineMenu:   PropTypes.object,
    showInf:      PropTypes.bool,
  }

  constructor(props) { // just to handle two way databinding
     super(props);
     this.state = { message: props.value || '', focus: false }
  }

  componentWillReceiveProps (newProps) {
    newProps.value != undefined && this.setState({message: newProps.value});
  }

  render(){
    const { label, error, pattern, placeholder, onChange, onEnter, inlineMenu, type, style, showInf} = this.props

    const handleChange = (event) => {
      this.setState({... this.state, message: event.target.value});
    }

    const onBlur = () => {
      if (typeof onChange === "function") {
        onChange(this.state.message, moment(this.state.message, 'DD.MM.YYYY').isValid())
      }
    }

    const handlePick = (date) => {
      this.setState({... this.state, message: date=="" ? "" : moment(date).format('DD.MM.YYYY')});
      if (typeof onChange === "function") {
        onChange(date=="" ? "" :moment(date).format('DD.MM.YYYY'), moment(date).isValid())
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
        <input type={'text'} value={this.state.message} onChange={handleChange} placeholder={placeholder} onKeyPress={preventEnter.bind(this)} pattern="(\d{1,2}).(\d{1,2}).(\d{4})"/>
        <span className={styles.bar}></span>
        <label className={styles.label}>{label}</label>
        <label className={`${styles.customFormGroup}  ${styles.inlineMenu}`}>{inlineMenu}</label>
        <label className={`${styles.customFormGroup}  ${styles.error}`} style={{opacity: this.state.message==undefined || this.state.message == "" || moment(this.state.message, 'DD.MM.YYYY').isValid()? 0 : 1}}>{error}</label>
        <label  className={`${styles.customFormGroup}  ${styles.callendar}`} onClick={showDatepicker}><i className="fa fa-calendar" aria-hidden="true"></i></label>
        <PopupDatepicker showInf={showInf} onSelect={handlePick} date={moment(this.state.message, 'DD.MM.YYYY').isValid() ? moment(this.state.message, 'DD.MM.YYYY').format('YYYY-MM-DD') : undefined} show={this.state.focus} okClick={hideDatepicker}/>
      </div>
    )
  }
}

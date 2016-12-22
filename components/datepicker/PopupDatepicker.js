import React, { Component, PropTypes }  from 'react'
import ReactDOM                         from 'react-dom'
import moment                           from 'moment'

import Datepicker  from './Datepicker'
import styles      from './PopupDatepicker.scss'
import RoundButton from '../buttons/RoundButton'


export default class PopupDatepicker extends Component{
  static propTypes = {
    onSelect: PropTypes.func,
    okClick:  PropTypes.func,
    date:     PropTypes.string, //moment compatible format
    show:     PropTypes.bool
  }

  render(){
    const { onSelect, date, show, okClick, showInf } = this.props

    return(
      <div className={`${styles.popup} ${show ? "" : styles.hidden}`}>
        <Datepicker onSelect={onSelect} date={date} showInf={showInf}/>
        <div className={styles.buttonContainer}>
          <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={okClick} type='confirm'/>
        </div>
      </div>
    )
  }
}

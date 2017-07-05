import React, { Component, PropTypes }  from 'react'
import ReactDOM                         from 'react-dom'
import moment                           from 'moment'

import Datepicker  from './Datepicker'
import RoundButton from '../buttons/RoundButton'

import styles      from './PopupDatepicker.scss'


export default class PopupDatepicker extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    okClick:  PropTypes.func,
    date:     PropTypes.string, //moment compatible format
    show:     PropTypes.bool,
    flip:     PropTypes.bool
  }

  render(){
    const { onSelect, date, show, okClick, showInf, flip } = this.props

    return(
      <div className={`${styles.popup} ${show ? "" : styles.hidden}  ${flip && styles.flip}`}>
        <Datepicker onSelect={onSelect} date={date} showInf={showInf}/>
        <div className={styles.buttonContainer}>
          <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={okClick} type='confirm'/>
        </div>
      </div>
    )
  }
}

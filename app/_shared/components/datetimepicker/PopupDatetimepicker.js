import React, { Component, PropTypes }  from 'react'
import ReactDOM                         from 'react-dom'
import moment                           from 'moment'

import Datetimepicker from './Datetimepicker'
import styles         from './PopupDatetimepicker.scss'
import RoundButton    from '../buttons/RoundButton'


export default class PopupDatetimepicker extends Component{
  static propTypes = {
    onSelect: PropTypes.func,
    okClick:  PropTypes.func,
    datetime: PropTypes.string, //moment compatible format
    show:   PropTypes.bool
  }

  render(){
    const { onSelect, datetime, show, okClick } = this.props

    return(
      <div className={`${styles.popup} ${show ? "" : styles.hidden}`}>
        <Datetimepicker onSelect={onSelect} datetime={datetime}/>
        <div className={styles.buttonContainer}>
          <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={okClick} type='confirm'/>
        </div>
      </div>
    )
  }
}

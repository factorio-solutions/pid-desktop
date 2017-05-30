import React, { Component, PropTypes } from 'react'

import RoundButton  from '../buttons/RoundButton'

import styles       from './Form.scss'


export default function Form ({ children, onSubmit, onHighlight, onBack, submitable, mobile })  {
  const sendReservation = () => { submitable && onSubmit() }
  const highlightInputs = () => { onHighlight && onHighlight() }

  const back = typeof onBack === "function"

  var submitButton =  <div className={ mobile ? styles.mobileSubmitButton : styles.submitButton }>
                        {back && <div className={styles.floatLeft}>
                          <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={onBack}/>
                        </div>}
                        <div className={back && styles.floatRight}> 
                          <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={sendReservation} type='confirm' state={!submitable && 'disabled'} onDisabledClick={highlightInputs}/>
                        </div>
                      </div>

  return(
    <form onSubmit={sendReservation} >
      { children }
      { submitButton }
    </form>
  )
}

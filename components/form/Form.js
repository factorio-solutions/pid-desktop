import React, { Component, PropTypes } from 'react'

<<<<<<< HEAD
import styles       from './Form.scss'
import RoundButton  from '../buttons/RoundButton'

export default class Form extends Component {
  static propTypes = {
    onSubmit:   React.PropTypes.func.isRequired,
    submitable: React.PropTypes.bool.isRequired,
    onBack:     React.PropTypes.func,
    mobile:     React.PropTypes.bool
  }

  render(){
    const { children, onSubmit, onBack, submitable, mobile } = this.props

    const sendReservation = () => {
      submitable && onSubmit()
    }

    if (typeof onBack === "function") {
      var submitButton =  <div className={ mobile ? styles.mobileSubmitButton : styles.submitButton }>
                            <div className={styles.floatLeft}>
                              <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={onBack}/>
                            </div>
                            <div className={styles.floatRight}>
                              <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={sendReservation} type='confirm' state={!submitable && 'disabled'}/>
                            </div>
                          </div>
    } else {
      var submitButton =  <div className={mobile ? styles.mobileSubmitButton : styles.submitButton }>
                            <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={onSubmit} type='confirm' state={!submitable && 'disabled'}/>
                          </div>
    }

    return(
      <form onSubmit={sendReservation} >
        {this.props.children}

        {submitButton}
      </form>
    )
  }
=======
import RoundButton  from '../buttons/RoundButton'

import styles       from './Form.scss'


export default function Form ({ children, onSubmit, onBack, submitable, mobile })  {
  const sendReservation = () => { submitable && onSubmit() }

  const back = typeof onBack === "function"

  var submitButton =  <div className={ mobile ? styles.mobileSubmitButton : styles.submitButton }>
                        {back && <div className={styles.floatLeft}>
                          <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={onBack}/>
                        </div>}
                        <div className={back && styles.floatRight}>
                          <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={sendReservation} type='confirm' state={!submitable && 'disabled'}/>
                        </div>
                      </div>

  return(
    <form onSubmit={sendReservation} >
      { children }
      { submitButton }
    </form>
  )
>>>>>>> feature/new_api
}

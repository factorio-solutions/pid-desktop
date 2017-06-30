import React, { Component, PropTypes } from 'react'

import RoundButton  from '../buttons/RoundButton'

import styles       from './Form.scss'


export default class Form extends Component {
  static propTypes = {
    onSubmit:    PropTypes.func.isRequired,
    onHighlight: PropTypes.func,
    onBack:      PropTypes.func,
    submitable:  PropTypes.bool,
    mobile:      PropTypes.bool
  }

  constructor(props) {
     super(props);
     this.state = { submited: false }
  }

  componentWillReceiveProps(nextProps){

    this.setState({ submited: false })
  }

  render(){
    const { children, onSubmit, onHighlight, onBack, submitable, mobile } = this.props
    const sendReservation = () => {
      if (submitable){
        this.setState({ submited: true })
        onSubmit()
      }
    }
    const highlightInputs = () => { onHighlight && onHighlight() }
    const back = typeof onBack === "function"

    var submitButton =  <div className={ mobile ? styles.mobileSubmitButton : styles.submitButton }>
                          {back && <div className={styles.floatLeft}>
                            <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={onBack}/>
                          </div>}
                          <div className={back && styles.floatRight}>
                            {this.state.submited ? <RoundButton content={<span className={`fa fa-spinner ${styles.rotating}`} aria-hidden="true"></span>} onClick={()=>{}} type='confirm' state={'loading'} onDisabledClick={highlightInputs}/>
                                                 : <RoundButton content={<span className='fa fa-check' aria-hidden="true"></span>} onClick={sendReservation} type='confirm' state={!submitable && 'disabled'} onDisabledClick={highlightInputs}/>}
                          </div>
                        </div>

    return(
      <form onSubmit={sendReservation} >
        { children }
        { submitButton }
      </form>
    )
  }
}

import React, { Component, PropTypes } from 'react'

import RoundButton from '../buttons/RoundButton'

import styles from './Form.scss'


export default class Form extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    onSubmit:       PropTypes.func.isRequired,
    onHighlight:    PropTypes.func,
    onBack:         PropTypes.func,
    submitable:     PropTypes.bool,
    mobile:         PropTypes.bool,
    margin:         PropTypes.bool, // margin on the bottom
    modal:          PropTypes.bool, // is in modal, so no position fixed
    center:         PropTypes.bool, // center buttons
    home:           PropTypes.bool,  // show home button instead of chevron left
    submitbtnRight: PropTypes.bool
  }

  static defaultProps = {
    marginBot: true
  }

  constructor(props) {
    super(props)
    this.state = { submited: false }
  }

  componentWillReceiveProps() {
    this.setState({ submited: false })
  }

  render() {
    const { children, onSubmit, onHighlight, onBack, submitable, mobile, margin, modal, center, home, submitbtnRight } = this.props

    const sendReservation = () => {
      if (submitable) {
        this.setState({ submited: true })
        onSubmit()
      }
    }

    const highlightInputs = () => onHighlight && onHighlight()

    const submitButton = (<div
      className={`
        ${mobile ? styles.mobileSubmitButton : styles.submitBtn}
        ${margin && styles.marginBot}
        ${modal && styles.inModal}
        ${center && styles.center}
      `}
    >
      {onBack && <div className={styles.floatLeft}>
        <RoundButton
          content={<span className={`fa fa-${home ? 'home' : 'chevron-left'}`} aria-hidden="true" />}
          onClick={onBack}
        />
      </div>}
      <div className={(onBack || submitbtnRight) && styles.floatRight}>
        {this.state.submited ?
          <RoundButton
            content={<span className={`fa fa-spinner ${styles.rotating}`} aria-hidden="true" />}
            onClick={() => {}}
            type="confirm"
            state={'loading'}
            onDisabledClick={highlightInputs}
          /> :
          <RoundButton
            content={<span className="fa fa-check" aria-hidden="true" />}
            onClick={sendReservation}
            type="confirm"
            state={!submitable ? 'disabled' : undefined}
            onDisabledClick={highlightInputs}
          />
        }
      </div>
    </div>)

    return (
      <form onSubmit={sendReservation} >
        {children}
        {submitButton}
      </form>
    )
  }
}

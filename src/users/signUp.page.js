import React, { Component }   from 'react';
import styles                 from './signUp.page.scss'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link }               from 'react-router'

import Page         from '../_shared/containers/mobilePage/Page'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import PatternInput from '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'

import * as signUpActions from '../_shared/actions/signUp.actions'
import * as paths         from '../_resources/constants/RouterPaths'

import * as nav from '../_shared/helpers/navigation'

const MINIMUM_PASSWORD_LENGTH = 4


export class SignUpPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    const {state, signUpActions} = this.props

    const onSubmit = () => {
      const onSuccess = () => {
        this.context.router.push(paths.MENU)
      }
      signUpActions.register( onSuccess )
    }

    const goBack = () => {
      // nav.to(paths.LOGIN)
      this.context.router.push(paths.LOGIN)
    }

    const modalClick = () => {
      signUpActions.dismissModal()
    }

    const loadingContent = <div>Loading ...</div>

    const errorContent = <div>
                            Login failed: <br/>
                            { state.error && state.error.message } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={modalClick} type='confirm'  />
                         </div>

    const nameChanged         = (value, valid) => { signUpActions.setName( value, valid ) }
    const phoneChanged        = (value, valid) => { signUpActions.setPhone( value, (value=='' ? true : valid) ) }
    const emailChanged        = (value, valid) => { signUpActions.setEmail( value, valid ) }
    const passwordChanged     = (value, valid) => { signUpActions.setPassword( value, valid ) }
    const confirmationChanged = (value, valid) => { signUpActions.setConfirmation( value, valid ) }

    const isSubmitable        = () => { return state.name.valid && state.phone.valid && state.email.valid && state.phone.valid && state.password.valid && state.confirmation.valid }

    return (
      <Page label="Sign up!" hide={true} margin={true}>
        <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching||state.error!=undefined} />
        <div className={styles.signUpPage}>
          <p className={styles.center}>
            Hi, nice to meet you.
          </p>
          <p className={styles.center}>
            Please, fill-in some details:
          </p>

          <Form onSubmit={onSubmit} onBack={goBack} submitable={isSubmitable()} mobile={true}>
            <PatternInput onChange={nameChanged} label="your full name*" error="Invalid name" pattern="^(?!\s*$).+" value={state.name.value} />
            <PatternInput onChange={phoneChanged} label="phone number*" error="Invalid phone number" pattern="\+?\(?\d{2,4}\)?[\d\s-]{3,}" value={state.phone.value} />
            <PatternInput onChange={emailChanged} label="e-mail *" error="Ivalid e-mail address" pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" value={state.email.value} />
            <PatternInput onChange={passwordChanged} label="password *" error={"Minimum length is "+MINIMUM_PASSWORD_LENGTH} type='password' pattern={`\\w{${MINIMUM_PASSWORD_LENGTH},}`} value={state.password.value} />
            <PatternInput onChange={confirmationChanged} label="password confirmation *" error="Not matching password."  type='password' pattern={state.password.value} value={state.confirmation.value} />
          </Form>

          <p style={{ textAlign: 'center' }}>
            By creating a profile you agree with our <Link to={nav.path(paths.TERMS)}>Terms of Services</Link>
          </p>
        </div>
      </Page>
    );
  }
}


export default connect(state => {
  return ({
  state: state.signUp
})}, dispatch => ({
  signUpActions: bindActionCreators(signUpActions, dispatch)
}))(SignUpPage);

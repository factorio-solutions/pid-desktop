<<<<<<< HEAD
import React, { Component } from 'react';
import styles               from './signUp.page.scss'
=======
import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
>>>>>>> feature/new_api

import MasterPage   from '../_shared/components/masterLoginPage/MasterPage'
import Logo         from '../_shared/components/logo/Logo'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import PatternInput from  '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'

<<<<<<< HEAD
import * as nav from '../_shared/helpers/navigation'
import { t }    from '../_shared/modules/localization/localization'

import { init, register, dismissModal, setName, setPhone, setEmail, setPassword, setConfirmation } from '../_shared/actions/signUp.actions'


const MINIMUM_PASSWORD_LENGTH = 4

export default class SignUpPage extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  componentDidMount () {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() => { this.forceUpdate() })
    store.dispatch(init(this.props.location.query))
  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  render() {
    const { store } = this.context
    const state = store.getState().signUp

    const onSubmit = () => {
      isSubmitable() && store.dispatch(register())
    }

    const goBack = () => {
      nav.to('/')
    }

    const modalClick = () => {
      store.dispatch(dismissModal())
    }

    const loadingContent = <div>{t(['signup_page', 'loading'])} ...</div>

    const errorContent = <div>
                            {t(['signup_page', 'loginFailed'])}: <br/>
                            { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={modalClick} type='confirm'  />
                         </div>

    const nameChanged         = (value, valid) => { store.dispatch(setName( {value, valid} )) }
    const phoneChanged        = (value, valid) => { store.dispatch(setPhone( {value, valid: value=='' ? true : valid} )) }
    const emailChanged        = (value, valid) => { store.dispatch(setEmail( {value, valid} )) }
    const passwordChanged     = (value, valid) => { store.dispatch(setPassword( {value, valid} )) }
    const confirmationChanged = (value, valid) => { store.dispatch(setConfirmation( {value, valid} )) }

    const isSubmitable        = () => { return state.name.valid && state.phone.valid && state.email.valid && state.password.valid && state.confirmation.valid && state.password.value == state.confirmation.value}

=======
import * as nav           from '../_shared/helpers/navigation'
import { t }              from '../_shared/modules/localization/localization'
import * as signUpActions from '../_shared/actions/signUp.actions'

import styles from './signUp.page.scss'

const MINIMUM_PASSWORD_LENGTH = 4


const NAME_REGEX  = `^(?!\\s*$).+`
const PHONE_REGEX = `\\+?\\(?\\d{2,4}\\)?[\\d\\s-]{3,}`
const EMAIL_REGEX = `[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$`


export class SignUpPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount () {
    this.props.actions.init(this.props.location.query)
  }

  render() {
    const { actions, state } = this.props

    const onSubmit     = () => { isSubmitable() && actions.register() }
    const isSubmitable = () => { return state.name.valid
                                        && state.email.valid
                                        && state.phone.valid
                                        && state.password.valid
                                        && state.confirmation.valid
                                        && state.password.value == state.confirmation.value}
    const goBack       = () => { nav.to('/') }

    const loadingContent = <div>{ t(['signup_page', 'loading']) } ...</div>

    const errorContent = <div>
                           { t(['signup_page', 'loginFailed']) }: <br/>
                           { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={actions.dismissModal} type='confirm'  />
                         </div>

>>>>>>> feature/new_api
    const content = <div>
                      <Logo style='round'/>

                      <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching||state.error!=undefined} />
<<<<<<< HEAD

                      <div className={styles.signUpPage}>
                        <Form onSubmit={onSubmit} onBack={goBack} submitable={isSubmitable()}>
                          <PatternInput onEnter={onSubmit} onChange={nameChanged} label={t(['signup_page', 'name'])} error={t(['signup_page', 'nameInvalid'])} pattern="^(?!\s*$).+" value={state.name.value} />
                          <PatternInput onEnter={onSubmit} onChange={phoneChanged} label={t(['signup_page', 'phone'])} error={t(['signup_page', 'phoneInvalid'])} pattern="\+?\(?\d{2,4}\)?[\d\s-]{3,}" value={state.phone.value} />
                          <PatternInput onEnter={onSubmit} onChange={emailChanged} label={t(['signup_page', 'email'])} error={t(['signup_page', 'emailInvalid'])} pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" value={state.email.value} />
                          <PatternInput onEnter={onSubmit} onChange={passwordChanged} label={t(['signup_page', 'password'])} error={t(['signup_page', 'minimumLength'])+" "+MINIMUM_PASSWORD_LENGTH} type='password' pattern={`\\w{${MINIMUM_PASSWORD_LENGTH},}`} value={state.password.value} />
                          <PatternInput onEnter={onSubmit} onChange={confirmationChanged} label={t(['signup_page', 'confirmation'])} error={t(['signup_page', 'noMatching'])}  type='password' pattern={state.password.value} value={state.confirmation.value} />
                        </Form>
                      </div>

=======
                      <div className={styles.signUpPage}>
                        <Form onSubmit={onSubmit} onBack={goBack} submitable={isSubmitable()}>
                          <PatternInput onEnter={onSubmit} onChange={actions.setName}         label={t(['signup_page', 'name'])}          error={t(['signup_page', 'nameInvalid'])}                                               pattern={NAME_REGEX}  value={state.name.value} />
                          <PatternInput onEnter={onSubmit} onChange={actions.setPhone}        label={t(['signup_page', 'phone'])}         error={t(['signup_page', 'phoneInvalid'])}                                              pattern={PHONE_REGEX} value={state.phone.value} />
                          <PatternInput onEnter={onSubmit} onChange={actions.setEmail}        label={t(['signup_page', 'email'])}         error={t(['signup_page', 'emailInvalid'])}                                              pattern={EMAIL_REGEX} value={state.email.value} />
                          <PatternInput onEnter={onSubmit} onChange={actions.setPassword}     label={t(['signup_page', 'password'])}      error={t(['signup_page', 'minimumLength'])+" "+MINIMUM_PASSWORD_LENGTH} type='password' pattern={`\\w{${MINIMUM_PASSWORD_LENGTH},}`}          value={state.password.value} />
                          <PatternInput onEnter={onSubmit} onChange={actions.setConfirmation} label={t(['signup_page', 'confirmation'])}  error={t(['signup_page', 'noMatching'])}                                type='password' pattern={state.password.value}                        value={state.confirmation.value} />
                        </Form>
                      </div>
>>>>>>> feature/new_api
                    </div>

    return (
      <MasterPage content={content} />
    );
  }
}
<<<<<<< HEAD
=======


export default connect(
  state    => ({ state: state.signUp }),
  dispatch => ({ actions: bindActionCreators(signUpActions, dispatch) })
)(SignUpPage)
>>>>>>> feature/new_api

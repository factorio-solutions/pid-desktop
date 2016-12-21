import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import MasterPage   from '../_shared/components/masterLoginPage/MasterPage'
import Logo         from '../_shared/components/logo/Logo'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import PatternInput from  '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'

import * as nav           from '../_shared/helpers/navigation'
import { t }              from '../_shared/modules/localization/localization'
import * as signUpActions from '../_shared/actions/signUp.actions'

import styles from './signUp.page.scss'

const MINIMUM_PASSWORD_LENGTH = 4


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
    const isSubmitable = () => { return state.name.valid && state.phone.valid && state.email.valid && state.password.valid && state.confirmation.valid && state.password.value == state.confirmation.value}
    const goBack       = () => { nav.to('/') }

    const loadingContent = <div>{ t(['signup_page', 'loading']) } ...</div>

    const errorContent = <div>
                           { t(['signup_page', 'loginFailed']) }: <br/>
                           { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={actions.dismissModal} type='confirm'  />
                         </div>

    const content = <div>
                      <Logo style='round'/>

                      <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching||state.error!=undefined} />
                      <div className={styles.signUpPage}>
                        <Form onSubmit={onSubmit} onBack={goBack} submitable={isSubmitable()}>
                          <PatternInput onEnter={onSubmit} onChange={actions.setName}         label={t(['signup_page', 'name'])}          error={t(['signup_page', 'nameInvalid'])}                                               pattern="^(?!\s*$).+"                                 value={state.name.value} />
                          <PatternInput onEnter={onSubmit} onChange={actions.setPhone}        label={t(['signup_page', 'phone'])}         error={t(['signup_page', 'phoneInvalid'])}                                              pattern="\+?\(?\d{2,4}\)?[\d\s-]{3,}"                 value={state.phone.value} />
                          <PatternInput onEnter={onSubmit} onChange={actions.setEmail}        label={t(['signup_page', 'email'])}         error={t(['signup_page', 'emailInvalid'])}                                              pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"  value={state.email.value} />
                          <PatternInput onEnter={onSubmit} onChange={actions.setPassword}     label={t(['signup_page', 'password'])}      error={t(['signup_page', 'minimumLength'])+" "+MINIMUM_PASSWORD_LENGTH} type='password' pattern={`\\w{${MINIMUM_PASSWORD_LENGTH},}`}          value={state.password.value} />
                          <PatternInput onEnter={onSubmit} onChange={actions.setConfirmation} label={t(['signup_page', 'confirmation'])}  error={t(['signup_page', 'noMatching'])}                                type='password' pattern={state.password.value}                        value={state.confirmation.value} />
                        </Form>
                      </div>
                    </div>

    return (
      <MasterPage content={content} />
    );
  }
}


export default connect(
  state    => ({ state: state.signUp }),
  dispatch => ({ actions: bindActionCreators(signUpActions, dispatch) })
)(SignUpPage)

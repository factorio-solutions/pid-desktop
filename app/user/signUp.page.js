import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MasterPage   from '../_shared/components/masterLoginPage/MasterPage'
import Logo         from '../_shared/components/logo/Logo'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import PatternInput from  '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'
import Localization from '../_shared/components/localization/Localization'
import Checkbox     from '../_shared/components/checkbox/Checkbox'

import * as nav           from '../_shared/helpers/navigation'
import normalizeEmail     from '../_shared/helpers/normalizeEmail'
import { t, getLanguage } from '../_shared/modules/localization/localization'
import * as signUpActions from '../_shared/actions/signUp.actions'

import styles from './signUp.page.scss'

export const MINIMUM_PASSWORD_LENGTH = 4


const NAME_REGEX = '^(?!\\s*$).+'
const PHONE_REGEX = '\\+[\\d]{2,4}[\\d\\s]{3,}'
const EMAIL_REGEX = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$'


class SignUpPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    location: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.init(this.props.location.query)
  }

  onSubmit = () => this.isSubmitable() && this.props.actions.register()

  isSubmitable = () => {
    const { state } = this.props

    return state.name.valid
    && state.email.valid
    && state.phone.valid
    && state.password.valid
    && state.password.value === state.confirmation.value
    && state.acceptTermsOfService
  }

  goBack = () => nav.to('/')

  successConfirm = () => {
    this.props.actions.clearForm()
    this.goBack()
  }

  successContent = (
    <div>
      { t([ 'signup_page', 'success' ]) } <br />
      <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={this.successConfirm} type="confirm" />
    </div>
  )

  render() {
    const { actions, state } = this.props


    const loadingContent = <div>{ t([ 'signup_page', 'loading' ]) } ...</div>

    const errorContent = (<div>
      { t([ 'signup_page', 'loginFailed' ]) }: <br />
      { state.error } <br />
      <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={actions.dismissModal} type="confirm" />
    </div>)

    const handleTermsOfService = () => actions.setAcceptTermsOfService(!state.acceptTermsOfService)

    return (
      <MasterPage>
        <div className={styles.pageMargin}>
          <Logo style="round" />
          <Localization />

          <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching || state.error !== undefined} />
          <Modal show={state.success}>{this.successContent}</Modal>
          <div className={styles.signUpPage}>
            <Form onSubmit={this.onSubmit} onBack={this.goBack} submitable={this.isSubmitable()} center>
              <PatternInput
                onEnter={this.onSubmit}
                onChange={actions.setName}
                label={t([ 'signup_page', 'name' ])}
                error={t([ 'signup_page', 'nameInvalid' ])}
                pattern={NAME_REGEX}
                value={state.name.value}
              />
              <PatternInput
                onEnter={this.onSubmit}
                onChange={actions.setPhone}
                label={t([ 'signup_page', 'phone' ])}
                error={t([ 'signup_page', 'phoneInvalid' ])}
                pattern={PHONE_REGEX}
                value={state.phone.value}
              />
              <PatternInput
                onEnter={this.onSubmit}
                onChange={actions.setEmail}
                label={t([ 'signup_page', 'email' ])}
                error={t([ 'signup_page', 'emailInvalid' ])}
                pattern={EMAIL_REGEX}
                value={state.email.value}
                normalizeInput={normalizeEmail}
              />
              <PatternInput
                onEnter={this.onSubmit}
                onChange={actions.setPassword}
                label={t([ 'signup_page', 'password' ])}
                error={t([ 'signup_page', 'minimumLength' ]) + ' ' + MINIMUM_PASSWORD_LENGTH}
                type="password"
                pattern={`\\S{${MINIMUM_PASSWORD_LENGTH},}`}
                value={state.password.value}
              />
              <PatternInput
                onEnter={this.onSubmit}
                onChange={actions.setConfirmation}
                label={t([ 'signup_page', 'confirmation' ])}
                error={t([ 'signup_page', 'noMatching' ])}
                type="password"
                pattern={state.password.value}
                value={state.confirmation.value}
              />
              <Checkbox
                onChange={handleTermsOfService}
                checked={state.acceptTermsOfService}
              >
                <span onClick={handleTermsOfService}> {t([ 'signup_page', 'acceptTerms' ])} </span>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.park-it-direct.com/${getLanguage().replace('de', 'en').replace('pl', 'en')}/privacy`}>{t([ 'signup_page', 'termsOfService' ])}</a>
              </Checkbox>
            </Form>
          </div>
        </div>
      </MasterPage>
    )
  }
}


export default connect(
  state => ({ state: state.signUp }),
  dispatch => ({ actions: bindActionCreators(signUpActions, dispatch) })
)(SignUpPage)

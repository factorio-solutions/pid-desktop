import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { NavLink } from 'react-router-dom'
import Fingerprint2 from 'fingerprintjs2'
import localforage from 'localforage'

import MasterPage   from '../_shared/components/masterLoginPage/MasterPage'
import Logo         from '../_shared/components/logo/Logo'
import PatternInput from '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import Loading      from '../_shared/components/loading/Loading'

import * as nav           from '../_shared/helpers/navigation'
import normalizeEmail     from '../_shared/helpers/normalizeEmail'
import { t }              from '../_shared/modules/localization/localization'
import * as loginActions  from '../_shared/actions/login.actions'

import styles from './login.page.scss'


class LoginPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object,
    location: PropTypes.object,
    match:    PropTypes.object
  }

  constructor(props) {
    super(props)
    console.log('loginPage')
  }

  async componentDidMount() {
    const { actions, location } = this.props
    new Fingerprint2().get(actions.setDeviceFingerprint)
    if (location && location.query && location.query.token) {
      actions.resetStore()
      await localforage.setItem('jwt', location.query.token)
      nav.to('/occupancy')
    }
    if (location && location.query
    && location.query.hasOwnProperty('password_reset_success')) {
      actions.setShowPasswordResetModal(true)
      actions.setPasswordResetSuccessful(location.query.password_reset_success === 'true')
    }
  }

  home = () => window.location.href = 'https://parkit.direct';

  render() {
    const { actions, state, match } = this.props

    const isSubmitable = () => { return state.email.valid && state.password.valid }

    const onSubmit = () => {
      if (state.error) {
        actions.dismissModal()
      } else {
        isSubmitable() && actions.login(state.email.value, state.password.value, true)
      }
    }

    const loadingContent = <Loading show />

    const resetPasswordModalContent = success => (
      <div>
        <div>{ success ? t([ 'login_page', 'resetPasswordSuccessful' ]) : t([ 'login_page', 'resetPasswordUnsuccessful' ]) }</div>
        <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={actions.dismissModal} type="confirm" />
      </div>
    )

    const errorContent = (
      <div className={styles.redFont}>
        <div>
          {t([ 'login_page', 'loginFailed' ])}
          {':'}
        </div>
        <div>{state.error}</div>
        <RoundButton
          content={<i className="fa fa-times" aria-hidden="true" />}
          onClick={actions.dismissModal}
          type="red"
        />
      </div>
    )
    return (
      <MasterPage>
        <div className={styles.loginPage}>
          <Logo style="round" />

          <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching || state.error} />
          <Modal
            content={resetPasswordModalContent(state.passwordResetSuccessful)}
            show={state.showResetPasswordModal}
          />

          <Form onSubmit={onSubmit} onBack={this.home} submitable={isSubmitable()} center home>
            <PatternInput
              onChange={actions.setEmail}
              label={t([ 'login_page', 'email' ])}
              error={t([ 'login_page', 'invalid-email' ])}
              pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
              placeholder={t([ 'login_page', 'emailPlaceholder' ])}
              value={state.email.value}
              onEnter={onSubmit}
              normalizeInput={normalizeEmail}
            />
            <PatternInput
              onChange={actions.setPassword}
              label={t([ 'login_page', 'password' ])}
              type="password"
              pattern="^(?!\s*$).+"
              value={state.password.value}
              onEnter={onSubmit}
            />
          </Form>
          <div className={styles.resetPasswordPage}>
            {t([ 'login_page', 'forgot' ])}
            {' '}
            <NavLink to={`${match.url}resetPassword`}>{t([ 'login_page', 'proceed' ])}</NavLink>
            <button type="button" onClick={nav.to('/resetPassword')}>Ahoj</button>
          </div>

        </div>
      </MasterPage>
    )
  }
}

export default connect(
  state => ({ state: state.login }),
  dispatch => ({ actions: bindActionCreators(loginActions, dispatch) })
)(LoginPage)

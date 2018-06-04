import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import { Link }                         from 'react-router'
import Fingerprint2                     from 'fingerprintjs2'

import MasterPage   from '../_shared/components/masterLoginPage/MasterPage'
import Logo         from '../_shared/components/logo/Logo'
import PatternInput from '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import Loading      from '../_shared/components/loading/Loading'

import * as nav           from '../_shared/helpers/navigation'
import { t }              from '../_shared/modules/localization/localization'
import * as loginActions  from '../_shared/actions/login.actions'

import styles from './login.page.scss'


class LoginPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object,
    location: PropTypes.object
  }

  componentDidMount() {
    new Fingerprint2().get(this.props.actions.setDeviceFingerprint)
    if (this.props.location && this.props.location.query && this.props.location.query.token) {
      localStorage.jwt = this.props.location.query.token
      this.props.actions.resetStore()
      nav.to('/dashboard')
    }
  }

  home = () => window.location.href = 'https://www.park-it-direct.com';

  render() {
    const { actions, state } = this.props

    const isSubmitable = () => { return state.email.valid && state.password.valid }

    const onSubmit = () => {
      if (state.error) {
        actions.dismissModal()
      } else {
        isSubmitable() && actions.login(state.email.value, state.password.value, true)
      }
    }

    const loadingContent = <Loading show />

    const errorContent = (<div className={styles.redFont}>
      <div>{ t([ 'login_page', 'loginFailed' ]) }:</div>
      <div>{ state.error }</div>
      <RoundButton content={<i className="fa fa-times" aria-hidden="true" />} onClick={actions.dismissModal} type="red" />
    </div>)

    return (
      <MasterPage>
        <div className={styles.loginPage}>
          <Logo style="round" />

          <div className={styles.signUpPage}>
            {t([ 'login_page', 'please' ])} <Link to={nav.path('/signUpPage')} >{t([ 'login_page', 'Sign-Up' ])}</Link>
          </div>

          <div className={styles.resetPasswordPage}>
            {t([ 'login_page', 'forgot' ])} <Link to={nav.path('/resetPassword')} >{t([ 'login_page', 'proceed' ])}</Link>
          </div>

          <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching || state.error} />
          <Form onSubmit={onSubmit} onBack={this.home} submitable={isSubmitable()} center home>
            <PatternInput
              onChange={actions.setEmail}
              label={t([ 'login_page', 'email' ])}
              error={t([ 'login_page', 'invalid-email' ])}
              pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
              placeholder={t([ 'login_page', 'emailPlaceholder' ])}
              value={state.email.value}
              onEnter={onSubmit}
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
        </div>
      </MasterPage>
    )
  }
}

export default connect(
  state => ({ state: state.login }),
  dispatch => ({ actions: bindActionCreators(loginActions, dispatch) })
)(LoginPage)

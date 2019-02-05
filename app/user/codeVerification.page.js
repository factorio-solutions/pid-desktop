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
import Loading      from '../_shared/components/loading/Loading'

import * as nav          from '../_shared/helpers/navigation'
import { t }             from '../_shared/modules/localization/localization'
import * as loginActions from '../_shared/actions/login.actions'

import styles from './signUp.page.scss'


class CodeVerificationPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    if (this.props.state.email.value === '') nav.to('/')
  }

  onSubmit = () => this.isSubmitable() && this.props.actions.verifyCode(this.props.state.email.value, this.props.state.code.value)

  isSubmitable = () => this.props.state.code.valid

  goBack = () => nav.to('/')

  render() {
    const { actions, state } = this.props

    const loadingContent = <Loading show />

    const errorContent = (<div ref="error">
      { t([ 'login_page', 'loginFailed' ]) }: <br />
      { state.error } <br />
      <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={actions.dismissModal} type="confirm" />
    </div>)

    return (
      <MasterPage>
        <div className={styles.pageMargin}>
          <Logo style="round" />

          <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching || state.error !== undefined} />

          <div className={styles.resetPasswordPage}>{t([ 'loginVerification', 'description' ], { email: state.email.value })}</div>

          <Form onSubmit={this.onSubmit} onBack={this.goBack} submitable={this.isSubmitable()} center>
            <PatternInput
              onEnter={this.onSubmit}
              onChange={actions.setCode}
              label={t([ 'loginVerification', 'code' ])}
              error={t([ 'loginVerification', 'codeInvalid' ])}
              pattern="\d{6}$"
              value={state.code.value}
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
)(CodeVerificationPage)

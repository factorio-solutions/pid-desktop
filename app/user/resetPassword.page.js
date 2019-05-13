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

import * as nav                  from '../_shared/helpers/navigation'
import normalizeEmail            from '../_shared/helpers/normalizeEmail'
import { t }                     from '../_shared/modules/localization/localization'
import * as resetPasswordactions from '../_shared/actions/resetPassword.actions'

import styles from './signUp.page.scss'


class ResetPasswordPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  onSubmit = () => this.isSubmitable() && this.props.actions.sendPasswordReset()

  isSubmitable = () => this.props.state.email.valid

  goBack = () => nav.to('/login')

  render() {
    const { actions, state } = this.props

    const modalContent = (
      <div>
        { state.modal }
        <br />
        <RoundButton
          content={<i className="fa fa-check" aria-hidden="true" />}
          onClick={actions.dismissModal}
          type="confirm"
        />
      </div>
    )

    return (
      <MasterPage>
        <div className={styles.pageMargin}>
          <Logo style="round" />

          <Modal content={modalContent} show={state.modal !== undefined} />

          <div className={styles.resetPasswordPage}>{t([ 'resetPassword', 'description' ])}</div>

          <Form onSubmit={this.onSubmit} onBack={this.goBack} submitable={this.isSubmitable()} center>
            <PatternInput
              onEnter={this.onSubmit}
              onChange={actions.setEmail}
              label={t([ 'resetPassword', 'email' ])}
              error={t([ 'resetPassword', 'emailInvalid' ])}
              pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
              value={state.email.value}
              normalizeInput={normalizeEmail}
            />
          </Form>
        </div>
      </MasterPage>
    )
  }
}


export default connect(
  state => ({ state: state.resetPassword }),
  dispatch => ({ actions: bindActionCreators(resetPasswordactions, dispatch) })
)(ResetPasswordPage)

import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import MasterPage   from '../_shared/components/masterLoginPage/MasterPage'
import Logo         from '../_shared/components/logo/Logo'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import PatternInput from  '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'

import * as nav                  from '../_shared/helpers/navigation'
import { t }                     from '../_shared/modules/localization/localization'
import * as resetPasswordactions from '../_shared/actions/resetPassword.actions'

import styles from './signUp.page.scss'


export class ResetPasswordPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  render() {
    const { actions, state } = this.props

    const onSubmit     = () => { isSubmitable() && actions.sendPasswordReset() }
    const isSubmitable = () => { return state.email.valid}
    const goBack       = () => { nav.to('/') }

    const modalContent = <div>
                           { state.modal } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={actions.dismissModal} type='confirm'  />
                         </div>

    const content = <div>
                      <Logo style='round'/>

                      <Modal content={modalContent} show={state.modal!=undefined} />

                      <div className={styles.resetPasswordPage}>{t(['resetPassword', 'description'])}</div>

                      <Form onSubmit={onSubmit} onBack={goBack} submitable={isSubmitable()}>
                        <PatternInput onEnter={onSubmit} onChange={actions.setEmail} label={t(['resetPassword', 'email'])} error={t(['resetPassword', 'emailInvalid'])} pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"  value={state.email.value} />
                      </Form>
                    </div>

    return (
      <MasterPage content={content} />
    );
  }
}


export default connect(
  state    => ({ state: state.resetPassword }),
  dispatch => ({ actions: bindActionCreators(resetPasswordactions, dispatch) })
)(ResetPasswordPage)

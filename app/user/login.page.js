<<<<<<< HEAD
import React, { Component, PropTypes }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link }               from 'react-router'

import styles from './login.page.scss'
=======
import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import { Link }                         from 'react-router'
>>>>>>> feature/new_api

import MasterPage   from '../_shared/components/masterLoginPage/MasterPage'
import Logo         from '../_shared/components/logo/Logo'
import PatternInput from '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'
import Modal        from '../_shared/components/modal/Modal'
<<<<<<< HEAD
import Localization from '../_shared/components/localization/Localization'
import RoundButton  from '../_shared/components/buttons/RoundButton'

import * as nav     from '../_shared/helpers/navigation'
import { t }        from '../_shared/modules/localization/localization'
import * as loginActions from '../_shared/actions/login.actions'
=======
import RoundButton  from '../_shared/components/buttons/RoundButton'

import * as nav           from '../_shared/helpers/navigation'
import { t }              from '../_shared/modules/localization/localization'
import * as loginActions  from '../_shared/actions/login.actions'

import styles from './login.page.scss'
>>>>>>> feature/new_api


export class LoginPage extends Component {
  static propTypes = {
<<<<<<< HEAD
    state:        PropTypes.object,
    actions:      PropTypes.object
=======
    state:    PropTypes.object,
    actions:  PropTypes.object
>>>>>>> feature/new_api
  }

  render() {
    const { actions, state } = this.props

    const onSubmit = () => {
<<<<<<< HEAD
      isSubmitable() && actions.login(state.email.value, state.password.value , true)
    }

    const modalClick = () => {
      actions.dismissModal()
    }

    const loadingContent = <div>Loading ...</div>

    const errorContent = <div>
                            {t(['login_page', 'loginFailed'])}: <br/>
                            { state.error && (state.error.details.error_description ? state.error.details.error_description : state.error.code)} <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={modalClick} type='confirm'  />
                         </div>

    const emailChanged    = (value, valid) => { actions.setEmail( {value, valid} ) }
    const passwordChanged = (value, valid) => { actions.setPassword( {value, valid} ) }

    const isSubmitable    = () => { return state.email.valid && state.password.valid }

=======
      if (state.error) {
        actions.dismissModal()
      } else {
        isSubmitable() && actions.login(state.email.value, state.password.value , true)
      }
    }
    const isSubmitable    = () => { return state.email.valid && state.password.valid }

    const loadingContent = <div>Loading ...</div>

    const errorContent = <div ref="error">
                           { t(['login_page', 'loginFailed']) }: <br/>
                           { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={actions.dismissModal} type='confirm' />
                         </div>

>>>>>>> feature/new_api
    const content = <div>
                      <Logo style='round'/>

                      <div className={styles.signUpPage}>
                        {t(['login_page', 'please'])} <Link to={nav.path('/signUpPage')} >{t(['login_page', 'Sign-Up'])}</Link>
                      </div>
<<<<<<< HEAD

                      <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching||state.error!=undefined} />

                      <Form onSubmit={onSubmit} submitable={isSubmitable()}>
                        <PatternInput onChange={emailChanged} label={t(['login_page', 'email'])} error={t(['login_page', 'invalid-email'])} pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" placeholder='Mr@park.it' value={state.email.value} onEnter={onSubmit}/>
                        <PatternInput onChange={passwordChanged} label={t(['login_page', 'password'])} type='password' pattern="^(?!\s*$).+" value={state.password.value} onEnter={onSubmit}/>
=======
                      <div className={styles.resetPasswordPage}>
                        {t(['login_page', 'forgot'])} <Link to={nav.path('/resetPassword')} >{t(['login_page', 'proceed'])}</Link>
                      </div>

                      <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching || state.error!=undefined} />
                      <Form onSubmit={onSubmit} submitable={isSubmitable()}>
                        <PatternInput onChange={actions.setEmail} label={t(['login_page', 'email'])} error={t(['login_page', 'invalid-email'])} pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" placeholder='Mr@park.it' value={state.email.value} onEnter={onSubmit}/>
                        <PatternInput onChange={actions.setPassword} label={t(['login_page', 'password'])} type='password' pattern="^(?!\s*$).+" value={state.password.value} onEnter={onSubmit}/>
>>>>>>> feature/new_api
                      </Form>
                    </div>

    return (
      <MasterPage content={content} />
    );
  }
}

<<<<<<< HEAD
export default connect(state => {
  const { login } = state
  return ({
    state: login
  })
}, dispatch => ({
  actions: bindActionCreators(loginActions, dispatch)
}))(LoginPage)
=======

export default connect(
  state    => ({ state: state.login }),
  dispatch => ({ actions: bindActionCreators(loginActions, dispatch) })
)(LoginPage)
>>>>>>> feature/new_api

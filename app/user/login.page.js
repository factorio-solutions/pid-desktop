import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'
import { bindActionCreators }           from 'redux'
import { Link }                         from 'react-router'

import MasterPage   from '../_shared/components/masterLoginPage/MasterPage'
import Logo         from '../_shared/components/logo/Logo'
import PatternInput from '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'

import * as nav           from '../_shared/helpers/navigation'
import { t }              from '../_shared/modules/localization/localization'
import * as loginActions  from '../_shared/actions/login.actions'

import styles from './login.page.scss'


export class LoginPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  render() {
    const { actions, state } = this.props

    const onSubmit        = () => { isSubmitable() && actions.login(state.email.value, state.password.value , true) }
    const isSubmitable    = () => { return state.email.valid && state.password.valid }

    const loadingContent = <div>Loading ...</div>

    const errorContent = <div>
                           { t(['login_page', 'loginFailed']) }: <br/>
                           { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={actions.dismissModal} type='confirm' />
                         </div>

    const content = <div>
                      <Logo style='round'/>

                      <div className={styles.signUpPage}>
                        {t(['login_page', 'please'])} <Link to={nav.path('/signUpPage')} >{t(['login_page', 'Sign-Up'])}</Link>
                      </div>

                      <Modal content={state.fetching ? loadingContent : errorContent} show={state.fetching || state.error!=undefined} />
                      <Form onSubmit={onSubmit} submitable={isSubmitable()}>
                        <PatternInput onChange={actions.setEmail} label={t(['login_page', 'email'])} error={t(['login_page', 'invalid-email'])} pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" placeholder='Mr@park.it' value={state.email.value} onEnter={onSubmit}/>
                        <PatternInput onChange={actions.setPassword} label={t(['login_page', 'password'])} type='password' pattern="^(?!\s*$).+" value={state.password.value} onEnter={onSubmit}/>
                      </Form>
                    </div>

    return (
      <MasterPage content={content} />
    );
  }
}


export default connect(
  state    => ({ state: state.login }),
  dispatch => ({ actions: bindActionCreators(loginActions, dispatch) })
)(LoginPage)

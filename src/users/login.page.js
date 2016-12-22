import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { Link }                        from 'react-router'
import { bindActionCreators }          from 'redux'

import * as loginActions       from '../_shared/actions/login.actions'
import * as paths              from '../_resources/constants/RouterPaths'
import * as nav                from '../_shared/helpers/navigation'

// import LoginForm from './LoginForm/LoginForm.jsx'
import Logo         from '../_shared/components/logo/Logo'
import PatternInput from '../_shared/components/input/PatternInput'
import Form         from '../_shared/components/form/Form'
import Modal        from '../_shared/components/modal/Modal'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import styles       from './login.page.scss'
import Page         from '../_shared/containers/mobilePage/Page.js'

import { login, dismissModal, setEmail, setPassword } from '../_shared/actions/login.actions'


export class Login extends Component {
  static propTypes = {
    route: PropTypes.object,
    login: PropTypes.object,
    loginActions: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    const { login, loginActions } = this.props

    const onSubmit = () => {
      const callback = () => {
        this.context.router.push(paths.MENU)
      }
      loginActions.login(login.email.value, login.password.value , false, callback)
    }

    const handleRegisterClick = (e) => {
        this.context.router.push(paths.REGISTRATION)
      }

    const modalClick = () => {
        loginActions.dismissModal()
      }

    const loadingContent = <div>Loading ...</div>

    const errorContent = <div>
                           Login failed: <br/>
                           { login.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={modalClick} type='confirm'  />
                         </div>

     const emailChanged    = (value, valid) => { loginActions.setEmail( value, valid ) }
     const passwordChanged = (value, valid) => { loginActions.setPassword( value, valid ) }

     const isSubmitable    = () => { return login.email.valid && login.password.valid }

    return (
      <Page hideHeader={true} margin={true}>
        <div className={styles.center} >
          <Logo style='round'/>

          <p>
            Please, log-in or <Link to={paths.REGISTRATION} >Sign-Up</Link>
          </p>

          <Modal content={login.fetching ? loadingContent : errorContent} show={login.fetching||login.error!=undefined} />

          <Form onSubmit={onSubmit} submitable={isSubmitable()} mobile={true}>
            <PatternInput onChange={emailChanged} label="e-mail" error="Invalid email address" pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" placeholder='Mr@park.it' value={login.email.value}/>
            <PatternInput onChange={passwordChanged} label="password" type='password' pattern="^(?!\s*$).+" value={login.password.value} />
          </Form>
        </div>
      </Page>
    );
  }
}

export default connect(state => {
  const { login } = state
  return ({
    login
  })
}, dispatch => ({
  loginActions: bindActionCreators(loginActions, dispatch)
}))(Login)

import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'
import PatternInput from  '../_shared/components/input/PatternInput'
import Form     from '../_shared/components/form/Form'

import * as nav               from '../_shared/helpers/navigation'
import { t }                  from '../_shared/modules/localization/localization'
import * as editUserActions   from '../_shared/actions/editUser.actions'

// import styles from './newClient.page.scss'


export class EditUserPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initUser()
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => {
      checkSubmitable() && actions.submitUser()
    }

    const goBack = () => {
      nav.to('/settings')
    }

    const checkSubmitable = () => {
      return state.name.valid && state.phone.valid // && state.email.valid
    }

    const content = <div>
                      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                      <PatternInput onEnter={submitForm} onChange={actions.setName}         label={t(['signup_page', 'name'])}          error={t(['signup_page', 'nameInvalid'])}                                               pattern="^(?!\s*$).+"                                 value={state.name.value} />
                      <PatternInput onEnter={submitForm} onChange={actions.setPhone}        label={t(['signup_page', 'phone'])}         error={t(['signup_page', 'phoneInvalid'])}                                              pattern="\+?\(?\d{2,4}\)?[\d\s-]{3,}"                 value={state.phone.value} />
                      {/*<PatternInput onEnter={submitForm} onChange={actions.setEmail}        label={t(['signup_page', 'email'])}         error={t(['signup_page', 'emailInvalid'])}                                              pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"  value={state.email.value} />*/}
                      </Form>
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}

export default connect(
  state    => ({ state: state.editUser }),
  dispatch => ({ actions: bindActionCreators(editUserActions, dispatch) })
)(EditUserPage)

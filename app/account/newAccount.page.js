import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'
import Input    from '../_shared/components/input/Input'
import Form     from '../_shared/components/form/Form'

import * as nav               from '../_shared/helpers/navigation'
import { t }                  from '../_shared/modules/localization/localization'
import * as newAccountActions from '../_shared/actions/newAccount.actions'

import styles from './newAccount.page.scss'


export class NewAccountPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.setName('')
    this.props.params.id && this.props.actions.initAccount(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => {
      checkSubmitable() && actions.submitNewAccount(this.props.params.id)
    }

    const goBack = () => {
      nav.to('/accounts')
    }

    const checkSubmitable = () => {
      if (state.name == "") return false
      return true
    }

    const content = <div>
                      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                        <Input onEnter={submitForm} onChange={actions.setName} label={t(['newAccount', 'name'])} error={t(['newAccount', 'invalidName'])} value={state.name} name="account[name]" placeholder={t(['newAccount', 'placeholder'])}/>
                      </Form>
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}

export default connect(
  state    => ({ state: state.newAccount }),
  dispatch => ({ actions: bindActionCreators(newAccountActions, dispatch) })
)(NewAccountPage)

import React, { Component, PropTypes } from 'react';
import * as nav                        from '../_shared/helpers/navigation'
import { t }                           from '../_shared/modules/localization/localization'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase             from '../_shared/containers/pageBase/PageBase'
import PatternInput                from '../_shared/components/input/Input'
import Form                 from '../_shared/components/form/Form'

import * as editAccountActions from '../_shared/actions/editAccount.actions'

import styles from './newAccount.page.scss'


export class EditAccountPage extends Component {
  static contextTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initAccount(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    const handleNameChange = (value) => {
      actions.setName(value)
    }

    const submitForm = () => {
      checkSubmitable() && actions.submitEditAccount(this.props.params.id)
    }

    const goBack = () => {
      nav.to('/accounts')
    }

    const checkSubmitable = () => {
      if (state.name == "") return false
      return true
    }


    const content = <div>
                      <h2>{t(['editAccount', 'editAccount'])}</h2>
                      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                        <PatternInput onEnter={submitForm} onChange={handleNameChange} label={t(['newAccount', 'name'])} error={t(['newAccount', 'invalidName'])} value={state.name} pattern="^(?!\s*$).+" placeholder={t(['newAccount', 'placeholder'])}/>
                      </Form>
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}

export default connect(state => {
  const { editAccount } = state
  return ({
    state: editAccount
  })
}, dispatch => ({
  actions: bindActionCreators(editAccountActions, dispatch)
}))(EditAccountPage)

import React, { Component, PropTypes } from 'react';
import * as nav                        from '../_shared/helpers/navigation'
import { t }                           from '../_shared/modules/localization/localization'

import PageBase             from '../_shared/containers/pageBase/PageBase'
import Input                from '../_shared/components/input/Input'
import Form                 from '../_shared/components/form/Form'

import { setName, submitNewAccount } from '../_shared/actions/newAccount.actions'

import styles from './newAccount.page.scss'


export default class NewAccountPage extends Component {
  static contextTypes = {
    store: PropTypes.object
  }

  componentDidMount () {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() => { this.forceUpdate() })
  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  render() {
    const { store } = this.context
    const state = store.getState().newAccount

    const handleNameChange = (value) => {
      store.dispatch(setName(value))
    }

    const submitForm = () => {
      if (checkSubmitable()){
        store.dispatch(submitNewAccount())
      }
    }

    const goBack = () => {
      nav.to('/accounts')
    }

    const checkSubmitable = () => {
      if (state.name == "") return false
      return true
    }


    const content = <div>
                      <h2>{t(['newAccount', 'newAccount'])}</h2>
                      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                        <Input onEnter={submitForm} onChange={handleNameChange} label={t(['newAccount', 'name'])} error={t(['newAccount', 'invalidName'])} value={state.name} name="account[name]" placeholder={t(['newAccount', 'placeholder'])}/>
                      </Form>
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}

import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'
import Input    from '../_shared/components/input/Input'
import Form     from '../_shared/components/form/Form'

import * as nav               from '../_shared/helpers/navigation'
import { t }                  from '../_shared/modules/localization/localization'
import * as newClientActions from '../_shared/actions/newClient.actions'

import styles from './newClient.page.scss'


export class NewClientPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  componentDidMount(){
    this.props.actions.setName('')
    this.props.params.id && this.props.actions.initClient(this.props.params.id)
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => {
      checkSubmitable() && actions.submitNewClient(this.props.params.id)
    }

    const goBack = () => {
      nav.to('/clients')
    }

    const checkSubmitable = () => {
      if (state.name == "") return false
      return true
    }

    const content = <div>
                      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                        <Input onEnter={submitForm} onChange={actions.setName} label={t(['newClient', 'name'])} error={t(['newClient', 'invalidName'])} value={state.name} name="client[name]" placeholder={t(['newClient', 'placeholder'])}/>
                      </Form>
                    </div>

    return (
      <PageBase content={content}/>
    )
  }
}

export default connect(
  state    => ({ state: state.newClient }),
  dispatch => ({ actions: bindActionCreators(newClientActions, dispatch) })
)(NewClientPage)

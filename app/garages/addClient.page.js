import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'
import update                          from 'react-addons-update'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Input        from '../_shared/components/input/Input'
import Form         from '../_shared/components/form/Form'
import RoundButton  from '../_shared/components/buttons/RoundButton'
import GarageLayout from '../_shared/components/garageLayout/GarageLayout2'

import * as clientPlaceActions from '../_shared/actions/garageClients.actions'
import * as nav                 from '../_shared/helpers/navigation'
import { t }                    from '../_shared/modules/localization/localization'

import styles from './clients.page.scss'


export class AddClientPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    const submitForm = () => {
      checkSubmitable() && actions.submitNewClient()
    }

    const goBack = () => {
      nav.to(`/garages/${this.props.params.id}/clients`)
    }

    const checkSubmitable = () => {
      if (state.new_client_id == "") return false
      return true
    }

    const content = <div>
                      <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
                        <Input onEnter={submitForm} onChange={actions.setNewClientId} label={t(['garageManagement', 'newClientId'])} error={t(['garageManagement', 'newClientIdInvalid'])} value={state.name} name="client[name]" placeholder={t(['garageManagement', 'newClientIdPlaceholder'])} type="number"/>
                      </Form>
                    </div>

    return (
      <PageBase content={content} />
    )
  }
}

export default connect(
  state    => ({ state: state.garageClients }),
  dispatch => ({ actions: bindActionCreators(clientPlaceActions, dispatch) })
)(AddClientPage)

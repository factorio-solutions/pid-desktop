import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import ClientModules from './clientModules.page'
import Form          from '../../../_shared/components/form/Form'

import * as nav               from '../../../_shared/helpers/navigation'
import { t }                  from '../../../_shared/modules/localization/localization'
import * as timeCreditActions from '../../../_shared/actions/admin.timeCredit.actions'

import styles from './timeCredit.page.scss'


class TimeCreditPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object,
    params:   PropTypes.object
  }

  checkSubmitable = () => {
    return true
  }

  goBack = () => nav.to(`/${this.props.pageBase.garage}/admin/clients`)

  submitTimeCredit = () => this.checkNewTemplateSubmitable() && this.props.actions.submitNewTemplate(this.props.params.client_id)

  render() {
    const { state, actions, pageBase } = this.props

    return (
      <ClientModules params={this.props.params}>
        <Form onSubmit={this.submitTimeCredit} submitable={this.checkSubmitable()} onBack={this.goBack} onHighlight={actions.toggleHighlight}>
          <h1>{t([ 'newClient', 'Time credit client module' ])}</h1>
        </Form>
      </ClientModules>
    )
  }
}

export default connect(
  state => ({ state: state.timeCredit, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(timeCreditActions, dispatch) })
)(TimeCreditPage)

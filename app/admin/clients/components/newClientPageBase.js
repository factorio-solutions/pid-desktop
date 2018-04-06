import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase  from '../../../_shared/containers/pageBase/PageBase'
import TabMenu   from '../../../_shared/components/tabMenu/TabMenu'
import TabButton from '../../../_shared/components/buttons/TabButton'

import * as nav               from '../../../_shared/helpers/navigation'
import { t }                  from '../../../_shared/modules/localization/localization'
import * as newClientActions  from '../../../_shared/actions/newClient.actions'


class NewClientPageBase extends Component {
  static propTypes = {
    pageBase: PropTypes.object,
    actions:  PropTypes.object,
    children: PropTypes.object,
    params:   PropTypes.object
  }

  componentDidMount() {
    this.props.actions.clearForm()
    this.props.params.client_id && this.props.actions.initClient(this.props.params.client_id)
  }

  selectTab = tab => () => nav.to(`/${this.props.pageBase.garage}/admin/clients/${this.props.params.client_id}/${tab}`)

  tabFactory = tab => (<TabButton
    label={t([ 'newClient', tab ])}
    onClick={this.selectTab(tab)}
    state={this.props.params.client_id ? window.location.hash.includes(`/${tab}`) && 'selected' : 'disabled'}
  />)

  render() {
    const { children } = this.props

    const tabs = [ 'edit', 'smsSettings' ].map(this.tabFactory)

    return (
      <PageBase>
        <TabMenu left={tabs} />
        { children }
      </PageBase>
    )
  }
}

export default connect(
  state => ({ pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(newClientActions, dispatch) })
)(NewClientPageBase)

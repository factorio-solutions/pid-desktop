import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase  from '../../../_shared/containers/pageBase/PageBase'
import TabMenu   from '../../../_shared/components/tabMenu/TabMenu'
import TabButton from '../../../_shared/components/buttons/TabButton'

import * as nav               from '../../../_shared/helpers/navigation'
import { t }                  from '../../../_shared/modules/localization/localization'
import * as newClientActions  from '../../../_shared/actions/newClient.actions'


class ClientModules extends Component {
  static propTypes = {
    pageBase: PropTypes.object,
    children: PropTypes.object,
    params:   PropTypes.object
  }

  selectTab = tab => () => nav.to(`/${this.props.pageBase.garage}/admin/clients/${this.props.params.client_id}/${tab}`)

  tabFactory = tab => (<TabButton
    label={t([ 'newClient', tab ])}
    onClick={this.selectTab(tab)}
    state={window.location.hash.includes(`/${tab}`) && 'selected'}
  />)

  render() {
    const { children } = this.props

    const tabs = [ 'smsSettings', 'minMaxReservationDuration', 'timeCredit' ].map(this.tabFactory)

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
)(ClientModules)

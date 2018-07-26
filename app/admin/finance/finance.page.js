import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase        from '../../_shared/containers/pageBase/PageBase'
import TabMenu         from '../../_shared/components/tabMenu/TabMenu'
import TabButton       from '../../_shared/components/buttons/TabButton'
import RentsTab        from './tabs/rents'
import PaymentGatesTab from './tabs/paymentGates'
import SettingsTab     from './tabs/settings'
import BillingAddress  from './tabs/billingAddress'

import { t }               from '../../_shared/modules/localization/localization'
import * as financeActions from '../../_shared/actions/admin.finance.actions'


class FinancePage extends Component {
  static propTypes = {
    pageBase: PropTypes.object,
    params:   PropTypes.object,
    location: PropTypes.object
  }

  constructor(props) {
    super(props)

    const { pageBase, params, location } = props
    const FINANCE_TABS = [
      { name:    'paymentGates',
        content: <PaymentGatesTab params={params} location={location} />
      },
      pageBase.current_user && pageBase.current_user.garage_admin && {
        name:    'rents',
        content: <RentsTab />
      },
      pageBase.current_user && pageBase.current_user.garage_admin && {
        name:    'billingAddress',
        content: <BillingAddress />
      },
      { name:    'financeSettings',
        content: <SettingsTab params={params} />
      }
    ]

    this.state = {
      tabs:     FINANCE_TABS,
      selected: FINANCE_TABS[0].name,
      content:  FINANCE_TABS[0].content
    }
  }

  tabFactory = tab => (<TabButton
    label={t([ 'finance', tab.name ])}
    onClick={() => this.setState({
      ...this.state,
      selected: tab.name,
      content:  tab.content
    })}
    state={this.state.selected === tab.name && 'selected'}
  />)

  render() {
    const tabs = this.state.tabs
      .filter(o => o)
      .map(this.tabFactory)

    return (
      <PageBase>
        <TabMenu left={tabs} />
        {this.state.content}
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminFinance, pageBase: state.pageBase }), // { state: state.dashboard }
  dispatch => ({ actions: bindActionCreators(financeActions, dispatch) }) // { actions: bindActionCreators(dashboardActions, dispatch) }
)(FinancePage)

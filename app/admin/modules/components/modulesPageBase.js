import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase           from '../../../_shared/containers/pageBase/PageBase'
import TabMenu            from '../../../_shared/components/tabMenu/TabMenu'
import TabButton          from '../../../_shared/components/buttons/TabButton'
import Switch             from '../../../_shared/components/switch/Switch'
import CallToActionButton from '../../../_shared/components/buttons/CallToActionButton'
import Module             from '../../../_shared/components/module/Module'

import * as nav                 from '../../../_shared/helpers/navigation'
import { t }                    from '../../../_shared/modules/localization/localization'
import * as adminModulesActions from '../../../_shared/actions/admin.modules.actions'

const MODULE_PAGES = [ 'goPublic', 'goInternal', 'flexiplace', 'marketingPage' ]


class ModulesPageBase extends Component {
  static propTypes = {
    pageBase: PropTypes.object,
    state:    PropTypes.object,
    actions:  PropTypes.object,
    children: PropTypes.object
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initModules()
  }

  selectTab = tab => () => nav.to(`/${this.props.pageBase.garage}/admin/modules/${tab}`)

  tabFactory = tab => (<TabButton
    label={t([ 'modules', tab ])}
    onClick={this.selectTab(tab)}
    state={window.location.hash.includes(`/${tab}`) && 'selected'}
  />)

  render() {
    const { children, pageBase, state, actions } = this.props

    const tabs = MODULE_PAGES.map(this.tabFactory)

    const userGarage = pageBase.garages.find(garage => garage.garage.id === pageBase.garage)

    return (
      <PageBase>
        <TabMenu left={tabs} />

        {window.location.hash.includes('goPublic') &&
        <Module
          name={t([ 'modules', 'goPublic' ])}
          description={t([ 'modules', 'goPublicDescription' ])}
          disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2}
          actions={<Switch
            on={state.goPublic}
            state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}
            onClick={actions.toggleGoPublic}
          />}
        />}

        {window.location.hash.includes('goInternal') &&
        <Module
          name={t([ 'modules', 'goInternal' ])}
          description={t([ 'modules', 'goInternalDescription' ])}
          disabled={userGarage === undefined}
          actions={<Switch
            on={state.goInternal}
            state={(userGarage === undefined) && 'disabled'}
            onClick={this.toGoInternalSettings}
          />}
        />}

        {window.location.hash.includes('flexiplace') &&
        <Module
          name={t([ 'modules', 'flexiplace' ])}
          description={t([ 'modules', 'flexiplaceDescription' ])}
          actions={<Switch on={state.flexiplace} onClick={this.toggleFLexiplace} />}
        />}

        {window.location.hash.includes('marketingPage') &&
        <Module
          name={t([ 'modules', 'marketingPage' ])}
          disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2}
          actions={[
            <CallToActionButton
              label={t([ 'modules', 'Preview' ])}
              state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled' : 'inverted'}
              onClick={this.toMarketingPreview}
            />,
            <Switch
              on={state.marketing && state.marketing.active_marketing_launched}
              state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}
              onClick={actions.toggleMarketing}
            />
          ]}
        />}

        { ((window.location.hash.includes('goPublic') && !(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2 || state.flexiplace)) ||
          (window.location.hash.includes('goInternal') && userGarage) ||
          (window.location.hash.includes('flexiplace')) ||
          (window.location.hash.includes('marketingPage') && !(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2))) &&
          children
        }
      </PageBase>
    )
  }
}

export default connect(
  state => ({  state: state.adminModules, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(adminModulesActions, dispatch) })
)(ModulesPageBase)

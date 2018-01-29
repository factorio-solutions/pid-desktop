import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import Switch             from '../../_shared/components/switch/Switch'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import Module             from '../../_shared/components/module/Module'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as adminModulesActions from '../../_shared/actions/admin.modules.actions'

import styles from './modules.page.scss'


class ModulesPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initModules()
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage !== this.props.pageBase.garage && this.props.actions.initModules()
  }

  toGoPublicSettings = () => nav.to(`/${this.props.pageBase.garage}/admin/modules/goPublic`)

  toMarketingSettings = () => nav.to(`/${this.props.pageBase.garage}/admin/modules/marketingSettings`)

  toMarketingPreview = () => window.open('#' + nav.path(`/marketing/${this.props.state.short_name}`))

  toGoFlexiPlaceSettings = () => nav.to(`/${this.props.pageBase.garage}/admin/modules/flexiplace`)

  toggleFLexiplace = () => this.props.state.flexiplace ? this.props.actions.disableFlexiplace() : this.toGoFlexiPlaceSettings()

  render() {
    const { state, pageBase, actions } = this.props

    const userGarage = pageBase.garages.find(garage => garage.garage.id === pageBase.garage)

    const goPublicActions = [
      <CallToActionButton
        label={t([ 'modules', 'setting' ])}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2 || state.flexiplace) ? 'disabled' : 'inverted'}
        onClick={this.toGoPublicSettings}
      />,
      <Switch
        on={state.goPublic}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}
        onClick={actions.toggleGoPublic}
      />
    ]
    const flexiplaceActions = [
      <CallToActionButton label={t([ 'modules', 'setting' ])} state={'inverted'} onClick={this.toGoFlexiPlaceSettings} />,
      <Switch on={state.flexiplace} onClick={this.toggleFLexiplace} />
    ]
    const marketingActions = [
      <CallToActionButton
        label={t([ 'modules', 'Preview' ])}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled' : 'inverted'}
        onClick={this.toMarketingPreview}
      />,
      <CallToActionButton
        label={t([ 'modules', 'setting' ])}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled' : 'inverted'}
        onClick={this.toMarketingSettings}
      />,
      <Switch
        on={state.marketing && state.marketing.active_marketing_launched}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}
        onClick={actions.toggleMarketing}
      />
    ]


    return (
      <PageBase>
        <Module
          name={t([ 'modules', 'goPublic' ])}
          description={t([ 'modules', 'goPublicDescription' ])}
          disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2}
          actions={goPublicActions}
        />
        <Module
          name={t([ 'modules', 'flexiplace' ])}
          description={t([ 'modules', 'flexiplaceDescription' ])}
          actions={flexiplaceActions}
        />
        <Module
          name={t([ 'modules', 'marketingPage' ])}
          disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2}
          actions={marketingActions}
        />

        <div className={styles.bottomMargin} />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminModules, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(adminModulesActions, dispatch) })
)(ModulesPage)

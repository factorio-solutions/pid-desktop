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
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentWillReceiveProps(nextProps) { // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initModules()
  }

  componentDidMount() {
    this.props.pageBase.garage && this.props.actions.initModules()
  }

  render() {
    const { state, pageBase, actions } = this.props

    const userGarage = pageBase.garages.find(garage => garage.garage.id === pageBase.garage)

    const toGoPublicSettings = () => { nav.to(`/${pageBase.garage}/admin/modules/goPublic`) }
    const toMarketingSettings = () => { nav.to(`/${pageBase.garage}/admin/modules/marketingSettings`) }
    const toMarketingPreview = () => { window.open('#' + nav.path(`/marketing/${state.short_name}`)) }
    const toReservationFormSettings = () => { nav.to(`/${pageBase.garage}/admin/modules/reservationButton`) }
    const toMrParkitConnectionSettings = () => { nav.to(`/${pageBase.garage}/admin/modules/mrParkitIntegration`) }
    const toGoFlexiPlaceSettings = () => { nav.to(`/${pageBase.garage}/admin/modules/flexiplace`) }
    const toggleFLexiplace = () => {
      state.flexiplace ? actions.disableFlexiplace() : toGoFlexiPlaceSettings()
    }

    const goPublicActions = [
      <CallToActionButton label={t([ 'modules', 'setting' ])} state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2 || state.flexiplace) ? 'disabled' : 'inverted'} onClick={toGoPublicSettings} />,
      <Switch on={state.goPublic} state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'} onClick={actions.toggleGoPublic} />
    ]
    const flexiplaceActions = [
      <CallToActionButton label={t([ 'modules', 'setting' ])} state={'inverted'} onClick={toGoFlexiPlaceSettings} />,
      <Switch on={state.flexiplace} onClick={toggleFLexiplace} />
    ]
    const marketingActions = [
      <CallToActionButton label={t([ 'modules', 'Preview' ])} state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled' : 'inverted'} onClick={toMarketingPreview} />,
      <CallToActionButton label={t([ 'modules', 'setting' ])} state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled' : 'inverted'} onClick={toMarketingSettings} />,
      <Switch on={state.marketing && state.marketing.active_marketing_launched} state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'} onClick={actions.toggleMarketing} />
    ]


    return (
      <PageBase>
        <Module name={t([ 'modules', 'goPublic' ])} description={t([ 'modules', 'goPublicDescription' ])} disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2} actions={goPublicActions} />
        <Module name={t([ 'modules', 'flexiplace' ])} description={t([ 'modules', 'flexiplaceDescription' ])} actions={flexiplaceActions} />
        <Module name={t([ 'modules', 'marketingPage' ])} disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2} actions={marketingActions} />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminModules, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(adminModulesActions, dispatch) })
)(ModulesPage)

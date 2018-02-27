import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import Switch             from '../../_shared/components/switch/Switch'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'
import RoundButton        from '../../_shared/components/buttons/RoundButton'
import Module             from '../../_shared/components/module/Module'
import Modal              from '../../_shared/components/modal/Modal'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as adminModulesActions from '../../_shared/actions/admin.modules.actions'
import * as thirdPartyActions   from '../../_shared/actions/admin.thirdPartyIntegration.actions'

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

  toThirPartyIntegrationSettings = () => nav.to(`/${this.props.pageBase.garage}/admin/modules/3rdPartyIntegration`)

  toMrParkitIntegrationSettings = () => nav.to(`/${this.props.pageBase.garage}/admin/modules/mrParkitIntegration`)

  toggleThirdPartyIntegration = () => {
    if (this.props.state.thirdPartyIntegration) {
      const { actions } = this.props
      actions.disableThirdPartyIntegration()
      actions.setThirdPartyIntegration(false)
    } else {
      nav.to(`/${this.props.pageBase.garage}/admin/modules/3rdPartyIntegration`)
    }
  }

  toggleMrParkitIntegration = () => {
    if (this.props.state.mrParkitIntegration) {
      const { actions } = this.props
      actions.disableMrParkitIntegration()
      actions.setMrParkitIntegration(false)
    } else {
      nav.to(`/${this.props.pageBase.garage}/admin/modules/mrParkitIntegration`)
    }
  }

  copyToken = () => {
    this.token.select()
    document.execCommand('copy')
  }

  copyEndpoint = () => {
    this.endpoint.select()
    document.execCommand('copy')
  }


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

    const thirdPartyIntegrationActions = [
      <CallToActionButton
        label={t([ 'modules', 'showApiKey' ])}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled' : 'inverted'}
        onClick={actions.showApiEndpoint}
      />,
      <CallToActionButton
        label={t([ 'modules', 'regenerateApiKey' ])}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled' : 'inverted'}
        type="remove"
        onClick={actions.regenerateApiKey}
      />,
      <CallToActionButton
        label={t([ 'modules', 'setting' ])}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled' : 'inverted'}
        onClick={this.toThirPartyIntegrationSettings}
      />,
      <Switch
        on={state.thirdPartyIntegration}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}
        onClick={this.toggleThirdPartyIntegration}
      />
    ]

    const mrParkitIntegrationActions = [
      <CallToActionButton
        label={t([ 'modules', 'setting' ])}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled' : 'inverted'}
        onClick={this.toMrParkitIntegrationSettings}
      />,
      <Switch
        on={state.mrParkitIntegration}
        state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}
        onClick={this.toggleMrParkitIntegration}
      />
    ]

    const tokenModal = (<div>
      <div>
        <div className={styles.warning}>{t([ 'modules', 'warning' ])}</div>
        <div className={styles.warningDesribtion}>{t([ 'modules', 'warningDesribtion' ])}</div>
      </div>

      <div className={styles.copyField}>
        <h5>{t([ 'modules', 'apiEndpoint' ])}</h5>
        <input className={styles.tokenInput} ref={el => { this.endpoint = el }} value={(process.env.API_ENTRYPOINT || 'http://localhost:3000') + '/api/queries'} />
        <i className={`fa fa-files-o ${styles.copy}`} aria-hidden="true" onClick={this.copyEndpoint} />
      </div>

      <div className={styles.copyField}>
        <h5>{t([ 'modules', 'token' ])}</h5>
        <input className={styles.tokenInput} ref={el => { this.token = el }} value={state.token} />
        <i className={`fa fa-files-o ${styles.copy}`} aria-hidden="true" onClick={this.copyToken} />
      </div>

      <div className={styles.toApiExplorer}>
        <a href={(process.env.API_ENTRYPOINT || 'http://localhost:3000') + '/api/explorer'} target="_blank">{t([ 'modules', 'toApiExplorer' ])}</a>
      </div>

      <div className={styles.dismissButton}>
        <RoundButton content={<span className="fa fa-check" aria-hidden="true" />} onClick={actions.setToken} type="confirm" />
      </div>
    </div>)


    return (
      <PageBase>
        <Modal content={tokenModal} show={state.token} />

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

        <Module
          name={t([ 'modules', 'thirdPartyIntegration' ])}
          description={t([ 'modules', 'thirdPartyIntegrationDescription' ])}
          disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2}
          actions={thirdPartyIntegrationActions}
        />
        <Module
          name={t([ 'modules', 'mrParkitIntegration' ])}
          description={t([ 'modules', 'mrParkitIntegrationDescription' ])}
          disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2}
          actions={mrParkitIntegrationActions}
        />

        <div className={styles.bottomMargin} />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.adminModules, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...adminModulesActions, ...thirdPartyActions }, dispatch) })
)(ModulesPage)

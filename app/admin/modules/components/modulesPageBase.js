import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TabMenu            from '../../../_shared/components/tabMenu/TabMenu'
import TabButton          from '../../../_shared/components/buttons/TabButton'
import Switch             from '../../../_shared/components/switch/Switch'
import CallToActionButton from '../../../_shared/components/buttons/CallToActionButton'
import Module             from '../../../_shared/components/module/Module'
import Modal              from '../../../_shared/components/modal/Modal'
import RoundButton        from '../../../_shared/components/buttons/RoundButton'

import * as nav                 from '../../../_shared/helpers/navigation'
import { t }                    from '../../../_shared/modules/localization/localization'
import * as adminModulesActions from '../../../_shared/actions/admin.modules.actions'
import * as thirdPartyActions   from '../../../_shared/actions/admin.thirdPartyIntegration.actions'
import { disableGoInternal }    from '../../../_shared/actions/admin.goInternal.actions'

import styles from './modulesPageBase.scss'

const MODULE_PAGES = [ 'goPublic', 'goInternal', 'flexiplace', 'marketingPage', '3rdPartyIntegration', 'mrParkitIntegration' ]


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

  tabFactory = tab => (
    <TabButton
      label={t([ 'modules', tab ])}
      onClick={this.selectTab(tab)}
      state={window.location.hash.includes(`/${tab}`) && 'selected'}
    />
  )

  toGoInternalSettings = () => {
    const { state, actions } = this.props
    state.goInternal ? actions.disableGoInternal() : actions.toggleShowHint()
  }

  toMarketingPreview = () => window.open('#' + nav.path(`/marketing/${this.props.state.short_name}`))

  toggleFLexiplace = () => this.props.state.flexiplace ? this.props.actions.disableFlexiplace() : this.props.actions.toggleShowHint()

  toggleThirdPartyIntegration = () => {
    const { actions } = this.props
    if (this.props.state.thirdPartyIntegration) {
      actions.disableThirdPartyIntegration()
      actions.setThirdPartyIntegration(false)
    } else {
      actions.toggleShowHint()
    }
  }

  toggleMrParkitIntegration = () => {
    const { state, actions } = this.props
    if (state.mrParkitIntegration) {
      actions.disableMrParkitIntegration()
      actions.setMrParkitIntegration(false)
    } else {
      actions.toggleShowHint()
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
    const {
      children, pageBase, state, actions
    } = this.props

    const tabs = MODULE_PAGES.map(this.tabFactory)

    const userGarage = pageBase.garages.find(garage => garage.garage.id === pageBase.garage)

    const tokenModal = (
      <div>
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
          <div className={styles.warningDesribtion}>{t([ 'modules', 'requestDesribtionPart1' ])}</div>
          <div className={styles.headerDesribtion}>
            {t([ 'modules', 'requestDesribtionPart2' ])}
            {' '}
            {state.token}
          </div>
          <div className={styles.warningDesribtion}>{t([ 'modules', 'requestDesribtionPart3' ])}</div>
          <a href={(process.env.API_ENTRYPOINT || 'http://localhost:3000') + '/api/explorer'} target="_blank">{t([ 'modules', 'toApiExplorer' ])}</a>
        </div>

        <div className={styles.dismissButton}>
          <RoundButton content={<span className="fa fa-check" aria-hidden="true" />} onClick={actions.setToken} type="confirm" />
        </div>
      </div>
    )

    const hintModal = (
      <div>
        <div>{t([ 'modules', 'selectPlaces' ])}</div>

        <div className={styles.dismissButton}>
          <RoundButton content={<span className="fa fa-check" aria-hidden="true" />} onClick={actions.toggleShowHint} type="confirm" />
        </div>
      </div>
    )
    console.log('ModulesPageBase rerender')
    return (
      <React.Fragment>
        <Modal content={tokenModal} show={state.token} />
        <Modal content={hintModal} show={state.showHint} />
        <TabMenu left={tabs} />

        {window.location.hash.includes('goPublic') && (
          <Module
            name={t([ 'modules', 'goPublic' ])}
            description={t([ 'modules', 'goPublicDescription' ])}
            disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2}
            actions={(
              <Switch
                on={state.goPublic}
                state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}
                onClick={actions.toggleGoPublic}
              />
            )}
          />
        )}

        {window.location.hash.includes('goInternal')
        && (
        <Module
          name={t([ 'modules', 'goInternal' ])}
          description={t([ 'modules', 'goInternalDescription' ])}
          disabled={userGarage === undefined}
          actions={(
            <Switch
              on={state.goInternal}
              state={(userGarage === undefined) && 'disabled'}
              onClick={this.toGoInternalSettings}
            />
)}
        />
        )}

        {window.location.hash.includes('flexiplace')
        && (
        <Module
          name={t([ 'modules', 'flexiplace' ])}
          description={t([ 'modules', 'flexiplaceDescription' ])}
          actions={<Switch on={state.flexiplace} onClick={this.toggleFLexiplace} />}
        />
        )}

        {window.location.hash.includes('marketingPage')
        && (
        <Module
          name={t([ 'modules', 'marketingPage' ])}
          disabled={userGarage === undefined || !userGarage.admin}
          actions={[
            <CallToActionButton
              label={t([ 'modules', 'Preview' ])}
              state={(userGarage === undefined || !userGarage.admin) ? 'disabled' : 'inverted'}
              onClick={this.toMarketingPreview}
            />,
            <Switch
              on={state.marketing && state.marketing.active_marketing_launched}
              state={(userGarage === undefined || !userGarage.admin) && 'disabled'}
              onClick={actions.toggleMarketing}
            />
          ]}
        />
        )}

        {window.location.hash.includes('3rdPartyIntegration')
        && (
        <Module
          name={t([ 'modules', '3rdPartyIntegration' ])}
          description={t([ 'modules', 'thirdPartyIntegrationDescription' ])}
          disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2}
          actions={[
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
            <Switch
              on={state.thirdPartyIntegration}
              state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}
              onClick={this.toggleThirdPartyIntegration}
            />
          ]}
        />
        )}

        {window.location.hash.includes('mrParkitIntegration')
        && (
        <Module
          name={t([ 'modules', 'mrParkitIntegration' ])}
          description={t([ 'modules', 'mrParkitIntegrationDescription' ])}
          disabled={userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2}
          actions={[
            <Switch
              on={state.mrParkitIntegration}
              state={(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}
              onClick={this.toggleMrParkitIntegration}
            />
          ]}
        />
        )}

        {(
          (
            window.location.hash.includes('goPublic')
            && !(
              userGarage === undefined
              || userGarage.garage.active_pid_tarif_id < 2
              || state.flexiplace
            )
          )
          || (window.location.hash.includes('goInternal') && userGarage)
          || (window.location.hash.includes('flexiplace'))
          || (
            window.location.hash.includes('3rdPartyIntegration')
            && !(
              userGarage === undefined
              || userGarage.garage.active_pid_tarif_id < 2
            )
          )
          || (window.location.hash.includes('mrParkitIntegration') && !(userGarage === undefined || userGarage.garage.active_pid_tarif_id < 2))
          || (window.location.hash.includes('marketingPage') && !(userGarage === undefined || !userGarage.admin)))
          && children
        }
      </React.Fragment>
    )
  }
}

export default connect(
  state => ({ state: state.adminModules, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...adminModulesActions, ...thirdPartyActions, disableGoInternal }, dispatch) })
)(ModulesPageBase)

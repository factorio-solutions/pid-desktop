import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase           from '../../_shared/containers/pageBase/PageBase'
import Switch             from '../../_shared/components/switch/Switch'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as adminModulesActions from '../../_shared/actions/admin.modules.actions'

import styles from './modules.page.scss'


export class ModulesPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initModules()
  }

  componentDidMount(){
    this.props.pageBase.garage && this.props.actions.initModules()
  }

  render() {
    const { state, pageBase, actions } = this.props

    const userGarage = pageBase.garages.find(garage => garage.garage.id === pageBase.garage)

    const toGoPublicSettings = () => {nav.to(`/${pageBase.garage}/admin/modules/goPublic`)}
    const toMarketingSettings = () => {nav.to(`/${pageBase.garage}/admin/modules/marketingSettings`)}
    const toReservationFormSettings = () => {nav.to(`/${pageBase.garage}/admin/modules/reservationButton`)}
    const toMrParkitConnectionSettings = () => {nav.to(`/${pageBase.garage}/admin/modules/mrParkitIntegration`)}

    return (
      <PageBase>
        <div className={styles.module}>
          <div className={styles.goPublic}>
            {t(['modules','goPublic'])}
          </div>
          {t(['modules','goPublicDescription'])}
          <div className={styles.settings}>
            <CallToActionButton label={t(['modules','setting'])} state={(userGarage===undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled': 'inverted'} onClick={toGoPublicSettings} />
            <Switch on={state.goPublic} state={(userGarage===undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'} onClick={actions.toggleGoPublic}/>
          </div>
        </div>

        <div className={styles.module}>
          {t(['modules','marketingPage'])}
          <div className={styles.settings}>
            <CallToActionButton label={t(['modules','setting'])} state={(userGarage===undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled': 'inverted'} onClick={toMarketingSettings} />
            <Switch on={state.marketing && state.marketing.active_marketing_launched} state={(userGarage===undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'} onClick={actions.toggleMarketing}/>
          </div>
        </div>

        <div className={styles.module}>
          {t(['modules','reservationForm'])}
          <div className={styles.settings}>
            <CallToActionButton label={t(['modules','setting'])} state={(userGarage===undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled': 'inverted'} onClick={toReservationFormSettings} />
            <Switch on={state.reservationForm} state={(userGarage===undefined || userGarage.garage.active_pid_tarif_id < 2) && 'disabled'}/>
          </div>
        </div>

        <div className={styles.module}>
          {t(['modules','connectWithMrParkit'])}
          <div className={styles.settings}>
            <CallToActionButton label={t(['modules','setting'])} state={(userGarage===undefined || userGarage.garage.active_pid_tarif_id < 2) ? 'disabled': 'inverted'} onClick={toMrParkitConnectionSettings} />
            <Switch on={state.mrParkitConntection} state={(userGarage===undefined || userGarage.garage.active_pid_tarif_id < 3) && 'disabled'}/>
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.adminModules, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(adminModulesActions, dispatch) })
)(ModulesPage)

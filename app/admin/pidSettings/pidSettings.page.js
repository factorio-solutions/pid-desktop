import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase    from '../../_shared/containers/pageBase/PageBase'
import FeatureCard from '../../_shared/components/featureCard/FeatureCard'

import * as nav                 from '../../_shared/helpers/navigation'
import { t }                    from '../../_shared/modules/localization/localization'
import * as addFeaturesActions  from '../../_shared/actions/addFeatures.actions'
import * as pidSettingsActions  from '../../_shared/actions/admin.pidSettings.actions'

import styles from './pidSettings.page.scss'



export class PidSettingsPage extends Component {
  static propTypes = {
    state:    PropTypes.object,
    pageBase: PropTypes.object,
    actions:  PropTypes.object
  }

  componentDidMount() {
    this.props.state.tarifs.length === 0 && this.props.actions.initTarifs()
    this.props.pageBase.garage && this.props.actions.initSelected()
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.pageBase.garage != this.props.pageBase.garage && this.props.actions.initSelected()
  }


  render() {
    const { state, actions, pageBase } = this.props


    const longtermClick     = () => { state.selected !== 1 && actions.changeGarageTarif(this.props.params.id, 1) }
    const automationClick   = () => { state.selected !== 2 && actions.changeGarageTarif(this.props.params.id, 2) }
    const integrationClick  = () => { state.selected !== 3 && actions.changeGarageTarif(this.props.params.id, 3) }

    let longTerm = {...addFeaturesActions.prepareLongTermOrPersonal()
      , onClick:longtermClick
      , state: state.selected === 1 && 'selected'
    }

    let automationAndAccess = {...addFeaturesActions.prepareAutomationAndAccess(state)
      , onClick:automationClick
      , state: state.selected === 2 && 'selected'
    }

    let integrations = {...addFeaturesActions.prepareIntegrations(state)
      , onClick:integrationClick
      , state: state.selected === 3 && 'selected'
    }

    if (state.selected === 1) longTerm.buttonLabel = t(['addFeatures', 'selected'])
    if (state.selected === 2) automationAndAccess.buttonLabel = t(['addFeatures', 'selected'])
    if (state.selected === 3) integrations.buttonLabel = t(['addFeatures', 'selected'])

    return (
      <PageBase>
        <div className={styles.pricings}>
          <FeatureCard {...longTerm} />

          <FeatureCard {...automationAndAccess} />

          <FeatureCard {...integrations} />

          <FeatureCard {...addFeaturesActions.prepareCustom()} />
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state    => ({ state: state.addFeatures, pageBase: state.pageBase }), //{ state: state.dashboard }
  dispatch => ({ actions: bindActionCreators({...addFeaturesActions, ...pidSettingsActions}, dispatch) }) //{ actions: bindActionCreators(dashboardActions, dispatch) }
)(PidSettingsPage)

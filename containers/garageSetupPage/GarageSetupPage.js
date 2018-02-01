import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase    from '../pageBase/PageBase'
import TabButton   from '../../components/buttons/TabButton'
import RoundButton from '../../components/buttons/RoundButton'
import Modal       from '../../components/modal/Modal'

import styles   from './GarageSetupPage.scss'

import { t }      from '../../modules/localization/localization'
import * as pageBaseActions from '../../actions/pageBase.actions'
import * as nav from '../../helpers/navigation'


class GarageSetupPage extends Component {
  static propTypes = {
    state:       PropTypes.object,
    garageSetup: PropTypes.object,
    children:    PropTypes.object,
    actions:     PropTypes.object
  }

  render() {
    const { state, garageSetup, actions, children } = this.props

    const preapareTabsButtons = tab => <TabButton label={tab.label} onClick={tab.onClick} state={tab.state} />

    const createState = selectedUrl => {
      const hash = window.location.hash
      return hash.includes(selectedUrl) ? 'selected' : hash.includes('admin') ? '' : 'disabled'
    }

    const tabs = [
      { label: t([ 'newGarage', 'garage' ]), onClick: () => nav.to(`/${state.garage}/admin/garageSetup/general`), state: createState('garageSetup/general') },
      { label: t([ 'newGarage', 'places' ]), onClick: () => nav.to(`/${state.garage}/admin/garageSetup/floors`), state: createState('garageSetup/floors') },
      { label: t([ 'newGarage', 'gates' ]), onClick: () => nav.to(`/${state.garage}/admin/garageSetup/gates`), state: createState('garageSetup/gates') },
      { label: t([ 'newGarage', 'order' ]), onClick: () => nav.to(`/${state.garage}/admin/garageSetup/order`), state: createState('garageSetup/order') },
      window.location.hash.includes('admin') ?
        { label: t([ 'newGarage', 'users' ]), onClick: () => nav.to(`/${state.garage}/admin/garageSetup/users`), state: createState('garageSetup/users') } :
        { label: t([ 'newGarage', 'subscribtion' ]), onClick: () => nav.to(`/${state.garage}/admin/garageSetup/subscribtion`), state: createState('garageSetup/subscribtion') }
    ]

    const errorContent = (<div className={styles.floatCenter}>
      { garageSetup.error } <br />
      <RoundButton content={<i className="fa fa-check" aria-hidden="true" />} onClick={actions.setError} type="confirm" />
    </div>)

    const processingContent = (<div className={styles.floatCenter}>
      {t([ 'newGarage', 'processing' ])}
    </div>)

    return (
      <PageBase>
        <Modal content={errorContent} show={garageSetup.error !== undefined && !garageSetup.fetching} />
        <Modal content={processingContent} show={garageSetup.fetching} />

        <div className={styles.tabs}>
          {tabs.map(preapareTabsButtons)}
        </div>

        <div className={styles.content}>
          {children}
        </div>

        <div className={styles.bottomMargin} />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pageBase, garageSetup: state.garageSetup }),
  dispatch => ({ actions: bindActionCreators(pageBaseActions, dispatch) })
)(GarageSetupPage)

import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import MasterPage from '../../components/masterPage/MasterPage'

import { t }      from '../../modules/localization/localization'
import * as nav from '../../helpers/navigation'

import styles from '../pageBase/PageBase.scss'

import * as pageBaseActions from '../../actions/pageBase.actions'
import * as loginActions    from '../../actions/login.actions'


class PageBase extends Component {
  static propTypes = {
    state:         PropTypes.object,
    actions:       PropTypes.object,
    notifications: PropTypes.object
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.props.actions.initialPageBase()
  }

  render() {
    const { state, actions, notifications } = this.props

    const vertical = [
      { label: t([ 'pageBase', 'Dashboard' ]), key: 'dashboard', icon: 'icon-dashboard', onClick: () => nav.to('/pid-admin/') },
      { label: t([ 'pageBase', 'Users' ]), key: 'users', icon: 'fa fa-user', onClick: () => nav.to('/pid-admin/users') },
      { label: t([ 'pidAdmin', 'pageBase', 'generator' ]), key: 'generator', icon: 'fa fa-fighter-jet', onClick: () => nav.to('/pid-admin/generator') },
      { label: t([ 'pidAdmin', 'pageBase', 'news' ]), key: 'news', icon: 'fa fa-newspaper-o', onClick: () => nav.to('/pid-admin/news') },
      { label: t([ 'pidAdmin', 'pageBase', 'finance' ]), key: 'finance', icon: 'fa fa-money', onClick: () => nav.to('/pid-admin/finance') },
      { label: t([ 'pageBase', 'Activity log' ]), key: 'logs', icon: 'fa fa-file-text', onClick: () => nav.to('/pid-admin/logs') },
      { label: t([ 'pidAdmin', 'pageBase', 'garageOverview' ]), key: 'garages', icon: 'icon-garage', onClick: () => nav.to('/pid-admin/garagesOverview') }
    ]

    const profileDropdown = [
      <div className={styles.dropdownContent} onClick={() => nav.to('/dashboard')}><i className="fa fa-backward" aria-hidden="true" />{t([ 'pidAdmin', 'pageBase', 'backToPid' ])}</div>,
      <div className={styles.dropdownContent} onClick={() => actions.logout()}><i className="fa fa-sign-out" aria-hidden="true" />{t([ 'pageBase', 'Logout' ])}</div>
    ]

    return (
      <div>
        <MasterPage
          name={state.current_user && state.current_user.full_name}
          messageCount={notifications.count}
          callToAction={[]}
          verticalMenu={vertical}
          verticalSelected={state.selected}
          verticalSecondaryMenu={[]}
          showSecondaryMenu={false}
          showHints={false}
          profileDropdown={profileDropdown}
        >
          <h1 style={{ textAlign: 'center' }}>{t([ 'pidAdmin', 'pageBase', 'adminMode' ])}</h1>
          {this.props.children}
        </MasterPage>
      </div>
    )
  }
}

export default connect(
  state => ({ state: state.pageBase, notifications: state.notifications }),
  dispatch => ({ actions: bindActionCreators({ ...pageBaseActions, ...loginActions }, dispatch) })
)(PageBase)

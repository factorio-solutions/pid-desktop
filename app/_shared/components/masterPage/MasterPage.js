import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import { Route, Switch } from 'react-router-dom'

import Logo                  from '../logo/Logo'
import CallToActionButton    from '../buttons/CallToActionButton'
import I                     from '../buttons/I'
import GarageSelector        from '../garageSelector/GarageSelector'
import VerticalMenu          from '../verticalMenu/VerticalMenu'
import VerticalSecondaryMenu from '../verticalMenu/VerticalSecondaryMenu'
import DropdownContent       from '../dropdown/DropdownContent'
import IconWithCount         from '../iconWithCount/IconWithCount'

import * as nav                 from '../../helpers/navigation'
import { logout }               from '../../actions/login.actions'
import { changeHints }          from '../../actions/profile.actions'
import {
  setShowSecondaryMenu,
  initialPageBase,
  toReservations,
  toOccupancy,
  toGarage
} from '../../actions/pageBase.actions'

import {
  getVerticalMenu,
  getProfileDropdown,
  getCallToAction
} from './MasterPage.selectors'

import styles from './MasterPage.scss'

import PageBase from '../../containers/pageBase/PageBase'
import NotificationsPage from '../../../notifications/notifications.page'
import OccupancyPage from '../../../occupancy/occupancy.page'
import ReservationsRoute from '../../../reservations/reservationsRoute'
import GaragePage from '../../../garage/garage.page'
import AnalyticsRouter from '../../../analytics/analytics.router'
import ProfileRoutes from '../../../user/profile.routes'
import AdminRoutes from '../../../admin/admin.routes'
import AddFeaturesRoutes from '../../../addFeatures/addFeatures.routes'
import PidAdminRoutes from '../../../pidAdmin/pidAdmin.routes'

import isIe from '../../helpers/internetExplorer'

const IS_IE = isIe()

class MasterPage extends Component {
  static propTypes = {
    actions:      PropTypes.object,
    match:        PropTypes.object,
    messageCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    verticalSelected: PropTypes.string,

    verticalSecondaryMenu:     PropTypes.array, // [{label, key, onClick}, ... ]
    verticalSecondarySelected: PropTypes.string,
    showSecondaryMenu:         PropTypes.bool,
    secondaryMenuBackButton:   PropTypes.object, // {label, onClick}
    currentUser:               PropTypes.object,

    hint:            PropTypes.object, // {hint, href}
    showScrollbar:   PropTypes.bool,
    location:        PropTypes.object,
    verticalMenu:    PropTypes.arrayOf(PropTypes.object),
    profileDropdown: PropTypes.arrayOf(PropTypes.object),
    callToAction:    PropTypes.arrayOf(PropTypes.object),
    inPidAdmin:      PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = { menu: false }

    this.hintStyle = IS_IE ? { top: '60px' } : undefined
  }

  componentDidMount() {
    this.props.actions.initialPageBase()
  }

  onHamburgerClick = () => {
    const { actions, showSecondaryMenu } = this.props
    this.setState(state => ({ ...state, menu: !showSecondaryMenu && !state.menu }))
    actions.setShowSecondaryMenu(false)
  }

  onLogoClick = () => nav.to('/occupancy')

  onMessageClick =() => nav.to('/notifications')

  verticalMenuClick = () => {
    const { menu } = this.state
    if (menu) {
      this.setState(state => ({ ...state, menu: false }))
    }
  }

  secondaryVerticalMenuClick = () => {
    this.setState({ menu: true })
    const { secondaryMenuBackButton } = this.props
    secondaryMenuBackButton.onClick()
  }

  render() {
    const {
      match,
      actions,
      showScrollbar,
      currentUser,
      verticalSelected,
      verticalSecondaryMenu,
      verticalSecondarySelected,
      secondaryMenuBackButton,
      showSecondaryMenu,
      hint,
      messageCount,
      location,
      verticalMenu,
      profileDropdown,
      callToAction,
      inPidAdmin
    } = this.props

    const showHints = currentUser && currentUser.hint && !inPidAdmin

    const createCallToActionButton = object => <CallToActionButton label={object.label} state={object.state} onClick={object.onClick} />

    return (
      <div>
        <div className={styles.horizontalMenu}>
          <a onClick={this.onHamburgerClick} className={styles.hamburger}>
            <i className="fa fa-bars" aria-hidden="true" />
          </a>
          <div className={styles.logoContainer} onClick={this.onLogoClick}>
            <Logo style="rect" />
          </div>

          <div className={styles.horizontalMenuContent}>
            <div className={styles.theContent}>
              <div className={styles.callToAction}>
                {callToAction.map(createCallToActionButton)}
              </div>

              <div className={styles.user}>
                <div className={styles.messages}>
                  {!showHints && <I size="small" onClick={actions.changeHints} />}
                </div>

                <IconWithCount
                  icon="icon-message"
                  count={messageCount}
                  onClick={this.onMessageClick}
                  type="dark"
                />

                <DropdownContent content={profileDropdown} style={styles.profileDropdown}>
                  <div key="userName" className={styles.profile}>
                    <i key="icon" className="icon-profile" aria-hidden="true" />
                    <span key="name" className={styles.name}>{currentUser && currentUser.full_name}</span>
                  </div>
                </DropdownContent>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.page}>
          <div className={`${styles.verticalMenu} ${showSecondaryMenu && styles.shift} ${this.state.menu && styles.active}`}>
            <GarageSelector />
            <VerticalMenu
              content={verticalMenu}
              verticalSelected={verticalSelected}
              onClick={this.verticalMenuClick}
            />
          </div>

          <div className={`${styles.secondaryVerticalMenu} ${showSecondaryMenu && styles.shift} ${verticalSecondarySelected === undefined && styles.hideAdmin}`}>
            <VerticalSecondaryMenu
              content={verticalSecondaryMenu}
              selected={verticalSecondarySelected}
              backContent={{ ...secondaryMenuBackButton, onClick: this.secondaryVerticalMenuClick }}
            />
          </div>

          <div className={`${styles.content} ${showSecondaryMenu && styles.shift}`}>
            {showHints && hint && (
              <div className={styles.hint} style={this.hintStyle}>
                <div className={styles.hintCross} onClick={actions.changeHints}>
                  <i className="fa fa-times" aria-hidden="true" />
                </div>
                <I />
                <div dangerouslySetInnerHTML={{ __html: hint.hint }} />
              </div>
            )}
            <div className={`${styles.children} ${showHints && hint && styles.hashHint} ${showScrollbar && styles.scrollbarVisible}`}>
              <PageBase>
                <Switch>
                  <Route path={`${match.path}/pid-admin`} component={PidAdminRoutes} />
                  <Route path={`${match.path}/notifications`} component={NotificationsPage} />
                  <Route path={`${match.path}/addFeatures`} component={AddFeaturesRoutes} />
                  <Route path={`${match.path}/occupancy`} component={OccupancyPage} />
                  <Route path={`${match.path}/reservations`} component={ReservationsRoute} />
                  <Route path={`${match.path}/:id/garage`} component={GaragePage} />
                  <Route path={`${match.path}/:id/analytics`} component={AnalyticsRouter} />
                  <Route path={`${match.path}/:id/admin`} component={AdminRoutes} />
                  <Route path={`${match.path}/profile`} component={ProfileRoutes} />
                </Switch>
              </PageBase>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {
    current_user:      currentUser,
    selected:          verticalSelected,
    secondaryMenu:     verticalSecondaryMenu,
    secondarySelected: verticalSecondarySelected,
    secondaryMenuBackButton,
    showSecondaryMenu,
    hint,
    showScrollbar,
    inPidAdmin
  } = state.pageBase
  const { count } = state.notifications

  return {
    currentUser,
    verticalSelected,
    verticalSecondaryMenu,
    verticalSecondarySelected,
    secondaryMenuBackButton,
    showSecondaryMenu,
    hint,
    showScrollbar,
    inPidAdmin,
    messageCount:    count,
    verticalMenu:    getVerticalMenu(state),
    profileDropdown: getProfileDropdown(state),
    callToAction:    getCallToAction(state)
  }
}

export default connect(
  mapStateToProps,
  dispatch => ({
    actions: bindActionCreators({
      changeHints, setShowSecondaryMenu, logout, initialPageBase, toReservations, toOccupancy, toGarage
    }, dispatch)
  })
)(MasterPage)

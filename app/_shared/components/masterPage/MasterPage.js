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

import { t } from '../../modules/localization/localization'


import * as nav                 from '../../helpers/navigation'
import { logout }               from '../../actions/login.actions'
import { changeHints }          from '../../actions/profile.actions'
import {
  setShowSecondaryMenu,
  analyticsClick,
  adminClick,
  initialPageBase,
  toReservations,
  toOccupancy,
  toGarage
} from '../../actions/pageBase.actions'

import styles from './MasterPage.scss'
import pageBaseStyles from '../../containers/pageBase/PageBase.scss'

import PageBase from '../../containers/pageBase/PageBase'
import NotificationsPage from '../../../notifications/notifications.page'
import OccupancyPage from '../../../occupancy/occupancy.page'
import ReservationsRoute from '../../../reservations/reservationsRoute'
import GaragePage from '../../../garage/garage.page'
import AnalyticsRouter from '../../../analytics/analytics.router'
import ProfileRoutes from '../../../user/profile.routes'
import AdminRoutes from '../../../admin/admin.routes'


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

    hint:                 PropTypes.object, // {hint, href}
    garage:               PropTypes.object,
    isGarageAdmin:        PropTypes.bool,
    isGarageManager:      PropTypes.bool,
    isGarageReceptionist: PropTypes.bool,
    isGarageSecurity:     PropTypes.bool,
    pid_tarif:            PropTypes.number,
    showScrollbar:        PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = { menu: false }
  }

  componentDidMount() {
    this.props.actions.initialPageBase()
  }

  onHamburgerClick = () => {
    this.setState({ menu: !this.props.showSecondaryMenu && !this.state.menu })
    this.props.actions.setShowSecondaryMenu(false)
  }

  onLogoClick = () => nav.to('/occupancy')

  onMessageClick =() => nav.to('/notifications')

  verticalMenuClick = () => this.setState({ menu: false })

  profileDropdown = () => {
    const {
      currentUser,
      actions
    } = this.props
    return [
      (
        <div key="showProfile" className={pageBaseStyles.dropdownContent} onClick={() => nav.to('/profile')}>
          <i className="icon-profile" aria-hidden="true" />
          {t([ 'pageBase', 'Profile' ])}
        </div>
      ),
      currentUser && currentUser.pid_admin && (
        <div key="toPIDAdmin" className={pageBaseStyles.dropdownContent} onClick={() => nav.to('/pid-admin')}>
          <i className="fa fa-wrench" aria-hidden="true" />
          {t([ 'pageBase', 'pidAdmin' ])}
        </div>
      ),
      (
        <div key="logout" className={pageBaseStyles.dropdownContent} onClick={actions.logout}>
          <i className="fa fa-sign-out" aria-hidden="true" />
          {t([ 'pageBase', 'Logout' ])}
        </div>
      )
    ].filter(field => field)
  }

  secondaryVerticalMenuClick = () => {
    this.setState({ menu: true })
    const { secondaryMenuBackButton } = this.props
    secondaryMenuBackButton.onClick()
  }

  renderVerticalMenu = () => {
    const {
      garage,
      isGarageAdmin,
      isGarageManager,
      isGarageReceptionist,
      isGarageSecurity,
      pid_tarif: pidTariff,
      actions
    } = this.props
    return [
      // state.current_user && state.current_user.occupancy_garages.length &&
      {
        label:   t([ 'pageBase', 'Occupancy' ]),
        key:     'occupancy',
        icon:    'icon-occupancy',
        onClick: () => {
          nav.to('/occupancy')
          actions.toOccupancy()
        }
      }, // edit preferences in pageBase.action too
      {
        label:   t([ 'pageBase', 'Reservation' ]),
        key:     'reservations',
        icon:    'icon-reservations',
        onClick: () => {
          nav.to('/reservations')
          actions.toReservations()
        }
      },
      (
        isGarageAdmin
        || isGarageManager
        || isGarageReceptionist
        || isGarageSecurity
      ) && {
        label:   t([ 'pageBase', 'Garage' ]),
        key:     'garage',
        icon:    'icon-garage',
        onClick: () => {
          nav.to(`/${garage}/garage`)
          actions.toGarage()
        }
      }, // edit preferences in pageBase.action too
      (
        (isGarageAdmin || isGarageManager)
        && pidTariff >= 2
      ) && {
        label:   t([ 'pageBase', 'analytics' ]),
        key:     'analytics',
        icon:    'icon-invoices',
        onClick: actions.analyticsClick
      },
      {
        label:   t([ 'pageBase', 'Admin' ]),
        key:     'admin',
        icon:    'icon-admin',
        onClick: actions.adminClick
      }
    ].filter(field => field) // will filter false states out
  }

  callToAction = () => {
    const {
      isGarageAdmin,
      garage
    } = this.props

    return [
      {
        label:   t([ 'pageBase', 'Create reservation' ]),
        onClick: () => nav.to('/reservations/newReservation')
      },
      isGarageAdmin && {
        label:   t([ 'pageBase', 'Create contract' ]),
        onClick: () => nav.to(`/${garage}/admin/clients/newContract`)
      }
    ].filter(field => field)
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
      messageCount
    } = this.props

    const showHints = currentUser && currentUser.hint

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
                {this.callToAction().map(createCallToActionButton)}
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

                <DropdownContent content={this.profileDropdown()} style={styles.profileDropdown}>
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
              content={this.renderVerticalMenu()}
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
              <div className={styles.hint}>
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
                  <Route path={`${match.path}/notifications`} component={NotificationsPage} />
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
    garage,
    isGarageAdmin,
    isGarageManager,
    isGarageReceptionist,
    isGarageSecurity,
    pid_tarif,
    showScrollbar
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
    garage,
    isGarageAdmin,
    isGarageManager,
    isGarageReceptionist,
    isGarageSecurity,
    pid_tarif,
    messageCount: count,
    showScrollbar
  }
}

export default connect(
  mapStateToProps,
  dispatch => ({
    actions: bindActionCreators({
      changeHints, setShowSecondaryMenu, logout, analyticsClick, adminClick, initialPageBase, toReservations, toOccupancy, toGarage
    }, dispatch)
  })
)(MasterPage)

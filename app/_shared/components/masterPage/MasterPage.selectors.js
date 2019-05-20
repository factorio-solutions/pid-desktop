import React from 'react'
import  { createSelector } from 'reselect'

import * as nav from '../../helpers/navigation'
import { t } from '../../modules/localization/localization'

import { store } from '../../../index'

import { logout } from '../../actions/login.actions'
import pageBaseStyles from '../../containers/pageBase/PageBase.scss'

const defaultEmptyArray = []

function getNormalVerticalMenu(
  garage,
  isGarageAdmin,
  isGarageManager,
  isGarageReceptionist,
  isGarageSecurity,
  pidTariff
) {
  return [
    {
      label:   t([ 'pageBase', 'Occupancy' ]),
      key:     'occupancy',
      icon:    'icon-occupancy',
      onClick: () => nav.to('/occupancy')
    }, // edit preferences in pageBase.action too
    {
      label:   t([ 'pageBase', 'Reservation' ]),
      key:     'reservations',
      icon:    'icon-reservations',
      onClick: () => nav.to('/reservations')
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
      onClick: () => nav.to(`/${garage}/garage`)
    },
    (
      (isGarageAdmin || isGarageManager)
      && pidTariff >= 2
    ) && {
      label:   t([ 'pageBase', 'analytics' ]),
      key:     'analytics',
      icon:    'icon-invoices',
      onClick: () => nav.to(`/${garage}/analytics/garageTurnover`)
    },
    {
      label:   t([ 'pageBase', 'Admin' ]),
      key:     'admin',
      icon:    'icon-admin',
      onClick: () => nav.to(`/${garage}/admin/invoices`)
    }
  ].filter(field => field) // will filter false states out
}

function getPidAdminVerticalMenu() {
  return [
    {
      label:   t([ 'pageBase', 'Dashboard' ]),
      key:     'dashboard',
      icon:    'icon-dashboard',
      onClick: () => nav.to('/pid-admin/dashboard')
    },
    {
      label:   t([ 'pageBase', 'Users' ]),
      key:     'users',
      icon:    'fa fa-user',
      onClick: () => nav.to('/pid-admin/users')
    },
    {
      label:   t([ 'pidAdmin', 'pageBase', 'generator' ]),
      key:     'generator',
      icon:    'fa fa-fighter-jet',
      onClick: () => nav.to('/pid-admin/generator')
    },
    {
      label:   t([ 'pidAdmin', 'pageBase', 'news' ]),
      key:     'news',
      icon:    'fa fa-newspaper-o',
      onClick: () => nav.to('/pid-admin/news')
    },
    {
      label:   t([ 'pidAdmin', 'pageBase', 'finance' ]),
      key:     'finance',
      icon:    'fa fa-money',
      onClick: () => nav.to('/pid-admin/finance')
    },
    {
      label:   t([ 'pageBase', 'Activity log' ]),
      key:     'logs',
      icon:    'fa fa-file-text',
      onClick: () => nav.to('/pid-admin/logs')
    },
    {
      label:   t([ 'pidAdmin', 'pageBase', 'garagesOverview' ]),
      key:     'garages',
      icon:    'icon-garage',
      onClick: () => nav.to('/pid-admin/garagesOverview')
    },
    {
      label:   t([ 'pidAdmin', 'pageBase', 'mobileAppVersion' ]),
      key:     'mobileAppVersion',
      icon:    'fa fa-mobile',
      onClick: () => nav.to('/pid-admin/mobileAppVersion')
    }
  ]
}

export const getVerticalMenu = createSelector(
  state => state.pageBase.current_user.language,
  state => state.pageBase.garage,
  state => state.pageBase.isGarageAdmin,
  state => state.pageBase.isGarageManager,
  state => state.pageBase.isGarageReceptionist,
  state => state.pageBase.isGarageSecurity,
  state => state.pageBase.pid_tarif,
  state => state.pageBase.inPidAdmin,
  (
    language,
    garage,
    isGarageAdmin,
    isGarageManager,
    isGarageReceptionist,
    isGarageSecurity,
    pidTarif,
    pidAdmin
  ) => {
    if (pidAdmin) {
      return getPidAdminVerticalMenu()
    } else {
      return getNormalVerticalMenu(
        garage,
        isGarageAdmin,
        isGarageManager,
        isGarageReceptionist,
        isGarageSecurity,
        pidTarif
      )
    }
  }
)

export const getProfileDropdown = createSelector(
  state => state.pageBase.current_user,
  state => state.pageBase.inPidAdmin,
  (currentUser, pidAdmin) => {
    return [
      !pidAdmin && (
        <div
          key="showProfile"
          className={pageBaseStyles.dropdownContent}
          onClick={() => nav.to('/profile')}
        >
          <i className="icon-profile" aria-hidden="true" />
          {t([ 'pageBase', 'Profile' ])}
        </div>
      ),
      !pidAdmin && currentUser && currentUser.pid_admin && (
        <div
          key="toPIDAdmin"
          className={pageBaseStyles.dropdownContent}
          onClick={() => nav.to('/pid-admin/dashboard')}
        >
          <i className="fa fa-wrench" aria-hidden="true" />
          {t([ 'pageBase', 'pidAdmin' ])}
        </div>
      ),
      pidAdmin && (
        <div className={pageBaseStyles.dropdownContent} onClick={() => nav.to('/occupancy')}>
          <i className="fa fa-backward" aria-hidden="true" />
          {t([ 'pidAdmin', 'pageBase', 'backToPid' ])}
        </div>
      ),
      (
        <div
          key="logout"
          className={pageBaseStyles.dropdownContent}
          onClick={() => store.dispatch(logout())}
        >
          <i className="fa fa-sign-out" aria-hidden="true" />
          {t([ 'pageBase', 'Logout' ])}
        </div>
      )
    ].filter(field => field)
  }
)

export const getCallToAction = createSelector(
  state => state.pageBase.current_user.language,
  state => state.pageBase.isGarageAdmin,
  state => state.pageBase.garage,
  state => state.pageBase.inPidAdmin,
  (
    lang,
    isGarageAdmin,
    garage,
    inPidAdmin
  ) => {
    if (inPidAdmin) {
      return defaultEmptyArray
    }
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
)

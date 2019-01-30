import React from 'react'
import PropTypes from 'prop-types'

import { t } from '../../modules/localization/localization'

import ButtonGroup      from '../buttons/ButtonGroup'
import ButtonStack      from '../buttonStack/ButtonStack'
import MobileMenuButton from '../buttons/MobileMenuButton'
import Localization     from '../localization/Localization'
import UserInfo         from '../userInfo/UserInfo'

import styles from './MobileSideMenu.scss'

const divider = <div className={styles.divider}><div className={styles.line} /></div>

const MobileSideMenu = ({
  currentUser,
  personal,
  version,
  online,
  onLogoutClick,
  onPersonalWorkChange,
  onLocalizationChange,
  ...props
}) => (
  <div>
    <UserInfo
      currentUser={currentUser}
      {...props}
    />
    {currentUser && currentUser.secretary && divider}
    {currentUser && currentUser.secretary && (
      <div className={styles.buttonGroup}>
        <ButtonGroup
          buttons={[
            {
              content:  t([ 'mobileApp', 'page', 'personal' ]),
              onClick:  () => onPersonalWorkChange(true),
              selected: personal
            },
            {
              content:  t([ 'mobileApp', 'page', 'work' ]),
              onClick:  () => onPersonalWorkChange(false),
              selected: !personal
            }
          ]}
        />
      </div>
    )}
    {divider}
    <ButtonStack divider={divider}>
      {[
        <MobileMenuButton
          key="sign-out"
          icon="sign-out"
          label={t([ 'mobileApp', 'page', 'logOut' ])}
          onClick={onLogoutClick}
          state={!online ? 'disabled' : undefined}
          size="75"
        />
      ]}
    </ButtonStack>

    <div className={styles.bottom}>
      <div className={styles.appVersion}>
        {t([ 'mobileApp', 'page', 'version' ])}
        {' '}
        {version}
      </div>
      <Localization afterChange={onLocalizationChange} />
    </div>
  </div>
)

MobileSideMenu.propTypes = {
  currentUser:          PropTypes.object,
  currentUserInfo:      PropTypes.object,
  personal:             PropTypes.bool,
  divider:              PropTypes.object,
  version:              PropTypes.string,
  online:               PropTypes.bool,
  onLogoutClick:        PropTypes.func,
  onPersonalWorkChange: PropTypes.func,
  onLocalizationChange: PropTypes.func
}

export default MobileSideMenu

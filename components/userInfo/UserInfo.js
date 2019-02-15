import React, { PropTypes } from 'react'

import { t } from '../../modules/localization/localization'

import RoundButton from  '../buttons/RoundButton'

import styles from './UserInfo.scss'

const UserInfo = ({ currentUser, onUserClick }) => {
  if (!currentUser) {
    return <div>{t([ 'mobileApp', 'page', 'userInfoUnavailable' ])}</div>
  }

  return (
    <div className={styles.currentUserInfo}> {/* currently singned in user information */}
      <div className={styles.buttonContainer}>
        <RoundButton
          content={<span className="fa fa-user" aria-hidden="true" />}
          onClick={onUserClick}
          type="action"
          state={undefined}
        />
      </div>
      <div>
        <div><b> {currentUser.full_name} </b></div>
        <div> {currentUser.email} </div>
        {currentUser.phone && <div>{currentUser.phone}</div>}
      </div>
    </div>
  )
}

UserInfo.propTypes = {
  currentUser: PropTypes.object,
  onUserClick: PropTypes.func
}

export default UserInfo

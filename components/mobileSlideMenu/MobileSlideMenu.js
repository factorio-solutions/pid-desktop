import React from 'react'
import PropTypes from 'prop-types'

import styles   from './MobileSlideMenu.scss'
import MobileSideMenu from '../mobileSideMenu/MobileSideMenu'


function MobileSlideMenu({ showSlideMenu, dimmerClick, ...props }) {
  return (
    <div>
      <div
        className={`${styles.dimmer} ${showSlideMenu ? '' : styles.hidden}`}
        onClick={dimmerClick}
      />
      <div className={`${styles.menu} ${showSlideMenu ? styles.shown : ''}`}>
        <MobileSideMenu {...props} />
      </div>
    </div>
  )
}

MobileSlideMenu.propTypes = {
  showSlideMenu: PropTypes.bool,
  dimmerClick:   PropTypes.func
}

export default MobileSlideMenu

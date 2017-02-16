import React, { Component, PropTypes }  from 'react';
import styles                           from './menu.page.scss'
import { Link }                         from 'react-router'

import Page             from '../_shared/containers/mobilePage/Page'
import ButtonStack      from '../_shared/components/buttonStack/ButtonStack'
import MobileMenuButton from '../_shared/components/buttons/MobileMenuButton'

import * as paths from '../_resources/constants/RouterPaths'

import * as nav from '../_shared/helpers/navigation'


export default class MenuPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
    store: React.PropTypes.object
  }

  render() {
    const { router, store } = this.context

    const accessClick = () => {
      router.push(paths.ACCESS)
    }

    const reservationsClick = () => {
      router.push(paths.RESERVATIONS)
    }

    const visitorClick = () => {
      router.push(paths.VISITORS)
    }

    const menuItems = [ {label: 'Access', icon: 'sign-in', onClick: accessClick }
                      , {label: 'My reservations', icon: 'ticket', onClick: reservationsClick }
                      // , {label: 'Visitor', icon: 'child', onClick: visitorClick }
                      ]

    const menuContent = (menuItem, index, arr) => {
      const buttonHeight = (document.documentElement.clientHeight - store.getState().mobileHeader.headerHeight) / arr.length
      return(
        <MobileMenuButton key={index} icon={menuItem.icon} label={menuItem.label} onClick={menuItem.onClick} type={menuItem.type} size={buttonHeight} />
      )
    }

    const divider = <div className={styles.divider}><div className={styles.line}> </div></div>

    return (
      <Page label="Welcome">
        <div id="menuContainer">

        <ButtonStack divider={divider}>
          { menuItems.map(menuContent) }
        </ButtonStack>

        </div>
      </Page>
    )
  }
}

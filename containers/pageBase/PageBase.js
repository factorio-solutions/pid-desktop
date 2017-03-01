import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

<<<<<<< HEAD
import Logo           from '../../components/logo/Logo'
import HorizontalMenu from '../../components/horizontalMenu/HorizontalMenu'
import VerticalMenu   from '../../components/verticalMenu/VerticalMenu'
import MasterPage     from '../../components/masterPage/MasterPage'
import ButtonStack    from '../../components/buttonStack/ButtonStack'
import RoundButton    from '../../components/buttons/RoundButton'
import Modal          from '../../components/modal/Modal'

import {t}         from '../../modules/localization/localization'
import * as nav    from '../../helpers/navigation'
=======
import Logo            from '../../components/logo/Logo'
import HorizontalMenu  from '../../components/horizontalMenu/HorizontalMenu'
import VerticalMenu    from '../../components/verticalMenu/VerticalMenu'
import MasterPage      from '../../components/masterPage/MasterPage'
import ButtonStack     from '../../components/buttonStack/ButtonStack'
import RoundButton     from '../../components/buttons/RoundButton'
import RoundTextButton from '../../components/buttons/RoundTextButton'
import Modal           from '../../components/modal/Modal'

import {t}      from '../../modules/localization/localization'
import * as nav from '../../helpers/navigation'
>>>>>>> feature/new_api

import styles from './PageBase.scss'

import * as pageBaseActions from '../../actions/pageBase.actions'
<<<<<<< HEAD
import * as loginActions from '../../actions/login.actions'

const MENU_BUTTON_COLLAPSE_WIDTH = 175
const ITEM_NUMBER_TO_COLLAPSE = 5
=======
import * as loginActions    from '../../actions/login.actions'

const MENU_BUTTON_COLLAPSE_WIDTH  = 175
const ITEM_NUMBER_TO_COLLAPSE     = 5
>>>>>>> feature/new_api


export class PageBase extends Component {
  static propTypes = {
    state:         PropTypes.object,
    actions:       PropTypes.object,
    notifications: PropTypes.object,

    content:       PropTypes.object,
    filters:       PropTypes.object
  }

  componentDidMount(){
<<<<<<< HEAD
=======
    window.scrollTo(0, 0)
>>>>>>> feature/new_api
    this.props.actions.initialPageBase()
  }

  render () {
    const { state, actions, notifications, content, filters } = this.props
<<<<<<< HEAD
    // const { store } = this.context
    //
    //
    // const notifications = store.getState().notifications
    // const state = store.getState().pageBase

=======

    const notificationClick = () => {
      actions.toNotifications()
      nav.to('/notifications')
    }
>>>>>>> feature/new_api

    const occupancyClick = () => {
      actions.toOccupancy()
      nav.to('/occupancy')
    }

    const reservationClick = () => {
      actions.toReservations()
      nav.to('/reservations')
    }

    const garageClick = () => {
      actions.toGarages()
      nav.to('/garages')
    }

<<<<<<< HEAD
    const accountClick = () => {
      actions.toAccounts()
      nav.to('/accounts')
    }

    const notificationClick = () => {
      actions.toNotifications()
      nav.to('/notifications')
=======
    const clientClick = () => {
      actions.toClients()
      nav.to('/clients')
    }

    const accountClick = () => {
      nav.to('/accounts')
>>>>>>> feature/new_api
    }

    const usersClick = () => {
      actions.toUsers()
      nav.to('/users')
    }

<<<<<<< HEAD
    const modalClick = () => {
      actions.setError(undefined)
    }

    const errorContent = <div style={{"textAlign": "center"}}>
                            {t(['pageBase', 'error'])}: <br/>
                            { state.error } <br/>
                           <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={modalClick} type='confirm'  />
                         </div>


     //<span className={styles.absoluteSpan}>{notifications.count}</span>
    let labels =  [ {label: <span>{t(['pageBase', 'notifications'])}</span>, icon: 'certificate', type:notifications.count>0 ?'action':null, onClick: notificationClick, count:notifications.count }
                  , {label: t(['pageBase', 'Occupancy']), icon: 'eye', onClick: occupancyClick }
                  , {label: t(['pageBase', 'Reservation']), icon: 'ticket', onClick: reservationClick }
                  , {label: t(['pageBase', 'Garages']), icon: 'home', onClick: garageClick }
                  , {label: t(['pageBase', 'Account & Users']), icon: 'users', onClick: accountClick }
                  , {label: t(['pageBase', 'Users']), icon: 'child', onClick: usersClick }
                  ]


    const settingClick = () => {
      nav.to('/settings')
    }
    const logoutClick = () => {
      actions.logout()
    }

    let labelsBottom =  [
      {label: state.current_user && state.current_user.full_name, icon: 'cog',onClick: settingClick },
      {label: t(['pageBase', 'Logout']), icon: 'sign-out',onClick: logoutClick }
    ]
=======
    const carsClick = () => {
      nav.to('/cars')
    }

    const addFeaturesClic = () => {
      nav.to('/addFeatures')
    }

    const settingClick = () => {
      nav.to('/settings')
    }

    const logoutClick = () => {
      actions.logout()
    }

    const modalClick = () => {
      actions.setError(undefined)
    }
    
    const notificationsModalClick = () => {
      actions.setShowModal(false)
    }

    const errorContent =  <div style={{"textAlign": "center"}}>
                            {t(['pageBase', 'error'])}: <br/>
                            { state.error } <br/>
                            <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={modalClick} type='confirm'  />
                          </div>

    const notificationsModal = <div style={{"textAlign": "center"}}>
                                {t(['pageBase', 'unredNotifications'], {count: notifications.count})}: <br/>
                                <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={notificationsModalClick} type='confirm'  />
                              </div>

    const garageRole  = state.current_user.garage_admin || state.current_user.receptionist || state.current_user.security
    const clientRole  = state.current_user.client_admin || state.current_user.secretary
    const accountRole = state.current_user.has_account
    const hasClient   = state.current_user.has_client
    const hasGarage   = state.current_user.has_garages

    const labels =  [ {label: <span>{t(['pageBase', 'notifications'])}</span>, key:"notifications", icon: 'certificate',                      onClick: notificationClick, type:notifications.count>0 ?'action':null, count:notifications.count }
                    , {label: t(['pageBase', 'Reservation']),                  key:"Reservation",   icon: 'ticket',                           onClick: reservationClick }
                    , {label: t(['pageBase', 'Cars']),                         key:"Cars",          icon: 'car',                              onClick: carsClick }
                    ]
    garageRole  && labels.push({label: t(['pageBase', 'Occupancy']),      key: "Occupancy",      icon: 'eye',   onClick: occupancyClick })
    hasGarage   && labels.push({label: t(['pageBase', 'Garages']),        key: "Garages",        icon: 'home',  onClick: garageClick })
    hasClient   && labels.push({label: t(['pageBase', 'Client & Users']), key: "Client & Users", icon: 'users', onClick: clientClick })
    accountRole && labels.push({label: t(['pageBase', 'accounts']),       key: "accounts",       icon: 'money', onClick: accountClick })
    hasClient   && labels.push({label: t(['pageBase', 'Users']),          key: "Users",          icon: 'child', onClick: usersClick })


    const  labelsBottom = [ {label: t(['pageBase', 'Logout']),                          icon: 'sign-out', onClick: logoutClick }
                          , {label: state.current_user && state.current_user.full_name, icon: 'cog',      onClick: settingClick }
                          ]
>>>>>>> feature/new_api

    const VerticalMenuItemSize = state.menuWidth < 175 ? 'collapsed' : labels.length+labelsBottom.length > ITEM_NUMBER_TO_COLLAPSE ? 'small' : 'normal'

    const bottomLabels =  <div className={styles.bottom}>
<<<<<<< HEAD
                            <div  className={styles.clickable} onClick={()=>{nav.to('/releaseNotes')}}> r20161130a </div>
=======
                            <RoundTextButton onClick={addFeaturesClic} content={t(['pageBase', 'addFeatures'])} type="action" />
                            <div  className={styles.clickable} onClick={()=>{nav.to('/releaseNotes')}}> r20170216a </div>
>>>>>>> feature/new_api
                            <VerticalMenu labels={labelsBottom} revertDivider={true} size={VerticalMenuItemSize}/>
                          </div>

    return (
      <div>
        <Modal content={errorContent} show={state.error!=undefined} />
<<<<<<< HEAD
=======
        <Modal content={notificationsModal} show={notifications.count>0 && state.notificationsModal } />
>>>>>>> feature/new_api
        <MasterPage
          logo={<Logo style='rect' />}
          horizContent={<HorizontalMenu labels={state.horizontalContent} selected={state.horizontalSelected} />}
          filters={filters}
<<<<<<< HEAD
          vertTopContent={<VerticalMenu labels={labels} selected={state.verticalSelected} size={VerticalMenuItemSize} ref="verticalMenu"/>}
          vertBotContent={bottomLabels}
          bodyContent={<div>
              {(state.current_user && state.current_user.hint && state.hint) &&
              <div className={styles.hint}>
                {state.hint}
              </div>}
              {content}
             </div>}
        />
      </div>

    );
  }
}


export default connect(state => {
  const { notifications, pageBase } = state
  return ({
    state: pageBase,
    notifications: notifications
  })
}, dispatch => ({
  actions: bindActionCreators(Object.assign({}, pageBaseActions, loginActions), dispatch)
}))(PageBase)
=======
          vertTopContent={<VerticalMenu labels={labels} selected={state.verticalSelected} size={VerticalMenuItemSize}/>}
          vertBotContent={bottomLabels}
          bodyContent={ <div>
                          {(state.current_user && state.current_user.hint && state.hint) && <div className={styles.hintContainer}>
                            {state.hintVideo && <RoundButton content={<i className="fa fa-info" aria-hidden="true"></i>} onClick={()=>{window.open(state.hintVideo)}} type='info'/>}
                            <div className={styles.hint}>  {state.hint} </div>
                          </div>}
                          {content}
                        </div> }
        />
      </div>
    )
  }
}

export default connect(
  state    => ({ state: state.pageBase, notifications: state.notifications }),
  dispatch => ({ actions: bindActionCreators(Object.assign({}, pageBaseActions, loginActions), dispatch) })
)(PageBase)
>>>>>>> feature/new_api

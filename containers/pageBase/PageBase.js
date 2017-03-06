import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

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

import styles from './PageBase.scss'

import * as pageBaseActions from '../../actions/pageBase.actions'
import * as loginActions    from '../../actions/login.actions'

const MENU_BUTTON_COLLAPSE_WIDTH  = 175
const ITEM_NUMBER_TO_COLLAPSE     = 5


export class PageBase extends Component {
  static propTypes = {
    state:         PropTypes.object,
    actions:       PropTypes.object,
    notifications: PropTypes.object,

    content:       PropTypes.object,
    filters:       PropTypes.object
  }

  componentDidMount(){
    window.scrollTo(0, 0)
    this.props.actions.initialPageBase()
  }

  render () {
    const { state, actions, notifications, content, filters } = this.props

    const notificationClick = () => {
      actions.toNotifications()
      nav.to('/notifications')
    }

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

    const clientClick = () => {
      actions.toClients()
      nav.to('/clients')
    }

    const accountClick = () => {
      nav.to('/accounts')
    }

    const usersClick = () => {
      actions.toUsers()
      nav.to('/users')
    }

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

    const VerticalMenuItemSize = state.menuWidth < 175 ? 'collapsed' : labels.length+labelsBottom.length > ITEM_NUMBER_TO_COLLAPSE ? 'small' : 'normal'

    const bottomLabels =  <div className={styles.bottom}>
                            <RoundTextButton onClick={addFeaturesClic} content={t(['pageBase', 'addFeatures'])} type="action" />
                            <div  className={styles.clickable} onClick={()=>{nav.to('/releaseNotes')}}> r20170216a </div>
                            <VerticalMenu labels={labelsBottom} revertDivider={true} size={VerticalMenuItemSize}/>
                          </div>

    return (
      <div>
        <Modal content={errorContent} show={state.error!=undefined} />
        <Modal content={notificationsModal} show={notifications.count>0 && state.notificationsModal } />
        <MasterPage
          logo={<Logo style='rect' />}
          horizContent={<HorizontalMenu labels={state.horizontalContent} selected={state.horizontalSelected} />}
          filters={filters}
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

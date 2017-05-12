import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import MasterPage from '../../components/masterPage/MasterPage'
import Modal      from '../../components/modal/Modal'
import RoundButton from '../../components/buttons/RoundButton'

import {t}      from '../../modules/localization/localization'
import * as nav from '../../helpers/navigation'

import styles from './PageBase.scss'

import * as pageBaseActions from '../../actions/pageBase.actions'
import * as loginActions    from '../../actions/login.actions'


export class PageBase extends Component {
  static propTypes = {
    state:         PropTypes.object,
    actions:       PropTypes.object,
    notifications: PropTypes.object
  }

  componentDidMount(){
    window.scrollTo(0, 0)
    this.props.actions.initialPageBase()
  }

  render () {
    const { state, actions, notifications } = this.props

    const vertical =  [{label: t(['pageBase','Dashboard']),     key: "dashboard",     icon: 'ticket',onClick: ()=>{nav.to(`/dashboard`)} }
                    ,  {label: t(['pageBase', 'Reservation']),  key: "reservations",  icon: 'car',   onClick: ()=>{nav.to('/reservations')} }
                    ,  {label: t(['pageBase', 'Occupancy']),    key: "occupancy",     icon: 'eye',   onClick: ()=>{nav.to(`/${state.garage}/occupancy`)} }
                    ,  {label: t(['pageBase', 'Garage']),       key: "garage",        icon: 'home',  onClick: ()=>{nav.to(`/${state.garage}/garage`)} }
                    ,  {label: t(['pageBase', 'Issues']),       key: "issues",        icon: 'users', onClick: ()=>{nav.to(`/${state.garage}/issues`)} }
                    ,  {label: t(['pageBase', 'Admin']),        key: "admin",         icon: 'money', onClick: ()=>{actions.adminClick()} }
                    ]

    const verticalSecondary =  [ {label: t(['pageBase', 'Invoices']),      key: "invoices",    onClick: ()=>{console.log('secondary menu click');} }
                               , {label: t(['pageBase', 'Clients']),       key: "clients",     onClick: ()=>{console.log('secondary menu click');} }
                               , {label: t(['pageBase', 'Modules']),       key: "modules",     onClick: ()=>{console.log('secondary menu click');} }
                               , {label: t(['pageBase', 'Garage setup']),  key: "garageSetup", onClick: ()=>{console.log('secondary menu click');} }
                               , {label: t(['pageBase', 'Users']),         key: "users",       onClick: ()=>{console.log('secondary menu click');} }
                               , {label: t(['pageBase', 'Finance']),       key: "finance",     onClick: ()=>{console.log('secondary menu click');} }
                               , {label: t(['pageBase', 'PID settings']),  key: "PID",         onClick: ()=>{console.log('secondary menu click');} }
                               , {label: t(['pageBase', 'Activity log']),  key: "activity",    onClick: ()=>{console.log('secondary menu click');} }
                               ]

    const callToAction = [ {label: t(['pageBase', 'Create reservation']), onClick: ()=>{nav.to('/reservations/newReservation')}}
                         , {label: t(['pageBase', 'Create contract']),    onClick: ()=>{console.log('call to action click')}}
                         , {label: t(['pageBase', 'Add Features']),       onClick: ()=>{nav.to('/addFeatures')}}
                         ]

    const garageSelector = [ {name: 'Fill', image: '../../../public/temp/garage1.jpg'}
                           , {name: 'Garages', image: '../../../public/temp/garage2.jpg'}
                           ]

    const profikeDropdown = [ <div className={styles.dropdownContent} onClick={()=>{nav.to('/profile')}}><i className="fa fa-user" aria-hidden="true"></i>{t(['pageBase', 'Profile'])}</div>
                            , <div className={styles.dropdownContent} onClick={()=>{actions.logout()}}><i className="fa fa-sign-out" aria-hidden="true"></i>{t(['pageBase', 'Logout'])}</div>
                            ]

    const hint = (state.current_user && state.current_user.hint && state.hint) ? {hint: state.hint, href: state.hintVideo} : undefined

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

    return (
      <div>
        <Modal content={errorContent} show={state.error!=undefined} />
        <Modal content={notificationsModal} show={notifications.count>0 && state.notificationsModal } />
        <Modal content={state.custom_modal} show={state.custom_modal!=undefined} />
        <MasterPage
          name={state.current_user && state.current_user.full_name}
          messageCount={notifications.count}
          callToAction={callToAction}
          verticalMenu={vertical}
          verticalSelected={state.selected}
          verticalSecondaryMenu={state.secondaryMenu}
          verticalSecondarySelected={state.secondarySelected}
          showSecondaryMenu={state.showSecondaryMenu}
          garageSelectorContent={garageSelector}
          onGarageSelect={(garage)=> {console.log(garage);}}
          showHints={state.current_user && state.current_user.hint}
          hint={state.hint}
          breadcrumbs={state.breadcrumbs}
          profileDropdown={profikeDropdown}
          secondaryMenuBackButton={state.secondaryMenuBackButton}
        >
          {this.props.children}
        </MasterPage>
      </div>
    )
  }
}

export default connect(
  state    => ({ state: state.pageBase, notifications: state.notifications }),
  dispatch => ({ actions: bindActionCreators(Object.assign({}, pageBaseActions, loginActions), dispatch) })
)(PageBase)

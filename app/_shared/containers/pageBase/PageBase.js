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

  componentDidMount () {
    window.scrollTo(0, 0)
    this.props.actions.initialPageBase()
  }

  componentWillReceiveProps(nextProps){ // load garage if id changed
    nextProps.state.garage != this.props.state.garage && this.props.actions.initialPageBase()
  }

  render () {
    const { state, actions, notifications } = this.props

    // console.log(state);

    const vertical =  [{label: t(['pageBase','Dashboard']),    key: "dashboard",    icon: 'icon-dashboard',    onClick: ()=>{nav.to(`/dashboard`)} }
                    ,  {label: t(['pageBase', 'Reservation']), key: "reservations", icon: 'icon-reservations', onClick: ()=>{nav.to('/reservations')} }
                    ,  (state.isGarageAdmin || state.isGarageReceptionist || state.isGarageSecurity) && {label: t(['pageBase', 'Occupancy']), key: "occupancy", icon: 'icon-occupancy', onClick: ()=>{nav.to(`/${state.garage}/occupancy`)} } // edit preferences in pageBase.action too
                    ,  (state.isGarageAdmin || state.isGarageReceptionist || state.isGarageSecurity) && {label: t(['pageBase', 'Garage']),    key: "garage",    icon: 'icon-garage',    onClick: ()=>{nav.to(`/${state.garage}/garage`)} } // edit preferences in pageBase.action too
                    ,  (state.isGarageAdmin && state.pid_tarif >= 2) && {label: t(['pageBase', 'analytics']), key: "analytics", icon: 'icon-invoices', onClick: ()=>{actions.analyticsClick()} } // edit preferences in pageBase.action too
                    // ,  {label: t(['pageBase', 'Issues']),       key: "issues",        icon: 'icon-issues', onClick: ()=>{nav.to(`/${state.garage}/issues`)} }
                    ,  {label: t(['pageBase', 'Admin']), key: "admin", icon: 'icon-admin', onClick: ()=>{actions.adminClick()} }
                    ].filter(field => field !== false)

    const callToAction = [ {label: t(['pageBase', 'Create reservation']),                      onClick: ()=>{nav.to('/reservations/newReservation')}}
                         , state.isGarageAdmin &&  {label: t(['pageBase', 'Create contract']), onClick: ()=>{nav.to(`/${state.garage}/admin/clients/newContract`)}}
                         , {label: t(['pageBase', 'Add Features']),                            onClick: ()=>{nav.to('/addFeatures')}}
                         ].filter(field => field !== false)

    const profileDropdown = [ <div className={styles.dropdownContent} onClick={()=>{nav.to('/profile')}}><i className="icon-profile" aria-hidden="true"></i>{t(['pageBase', 'Profile'])}</div>
                            , <div className={styles.dropdownContent} onClick={()=>{actions.logout()}}><i className="fa fa-sign-out" aria-hidden="true"></i>{t(['pageBase', 'Logout'])}</div>
                            ]

    const hint = (state.current_user && state.current_user.hint && state.hint) ? {hint: state.hint, href: state.hintVideo} : undefined

    const errorClick = () => {
      actions.setError(undefined)
    }
    const successClick = () => {
      actions.setSuccess(undefined)
    }

    const notificationsModalClick = () => {
      actions.setShowModal(false)
    }

    const errorContent =  <div style={{"textAlign": "center"}}>
                            {t(['pageBase', 'error'])}: <br/>
                            { state.error } <br/>
                            <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={errorClick} type='confirm'  />
                          </div>

    const successContent =  <div style={{"textAlign": "center"}}>
                            {t(['pageBase', 'success'])}: <br/>
                            { state.success } <br/>
                            <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={successClick} type='confirm'  />
                          </div>

    const notificationsModal = <div style={{"textAlign": "center"}}>
                                {t(['pageBase', 'unredNotifications'], {count: notifications.count})}: <br/>
                                <RoundButton content={<i className="fa fa-check" aria-hidden="true"></i>} onClick={notificationsModalClick} type='confirm'  />
                              </div>

    return (
      <div>
        <Modal content={errorContent} show={state.error!=undefined} />
        <Modal content={successContent} show={state.success!=undefined} />
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
          showHints={state.current_user && state.current_user.hint}
          hint={state.hint}
          breadcrumbs={state.breadcrumbs}
          profileDropdown={profileDropdown}
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

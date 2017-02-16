import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux'
import { connect }                      from 'react-redux'
import moment                           from 'moment'

import styles from './access.page.scss'

import Page        from '../_shared/containers/mobilePage/Page'
import Dropdown    from '../_shared/components/dropdown/Dropdown'
import SwipeToOpen from '../_shared/components/swipeToOpen/SwipeToOpen'

import * as accessActions       from '../_shared/actions/mobile.access.actions'
import * as headerActions       from '../_shared/actions/mobile.header.actions'
import * as reservationsActions from '../_shared/actions/reservations.actions'
import * as paths               from '../_resources/constants/RouterPaths'


export class AccessPage extends Component {
  static propTypes = {
    mobileHeader:   PropTypes.object,
    mobileAccess:   PropTypes.object,
    actions:      PropTypes.object
  };

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentDidMount(){
    this.props.actions.initReservations()
    this.props.actions.setMessage('Loading ...')
    this.props.actions.setOpened(undefined)
  }

  render() {
    const { mobileHeader, mobileAccess, reservations, actions } = this.props

    const openGarage = () => {
      actions.openGarage()
    }

    const back = () => {
      this.context.router.push(paths.MENU)
    }

    const checkReservation = () => {
      const ongoing = reservations.reservations.find(function(reservation){
        if (moment(moment()).isBefore(moment(reservation.begins_at))) return false
        if (moment(moment()).isAfter(moment(reservation.ends_at))) return false
        return true
      })
      return ongoing ? '' : 'disabled'
    }

    // TODO: set SwipeToOpen state to disabled when no ongoing reservation
    return (
      <Page label='Access' back={back}>
        <SwipeToOpen message={mobileAccess.message} onSwipe={openGarage} success={mobileAccess.opened} state={checkReservation()} size={document.documentElement.clientHeight - mobileHeader.headerHeight}/>
      </Page>
    )
  }
}

export default connect(state => {
  const { mobileHeader, mobileAccess, reservations } = state
  return ({
    mobileHeader,
    mobileAccess,
    reservations
  })
}, dispatch => ({
  actions: bindActionCreators(Object.assign({}, accessActions, headerActions, reservationsActions), dispatch)
}))(AccessPage)

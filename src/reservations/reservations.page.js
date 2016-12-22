import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux'
import { connect }                      from 'react-redux'

import styles from './reservations.page.scss'

import Page           from '../_shared/containers/mobilePage/Page'
import MobileTable    from '../_shared/components/mobileTable/MobileTable'
import ReservationRow from '../_shared/components/mobileTable/ReservationRow'

import * as paths from '../_resources/constants/RouterPaths'
import * as reservationsActions from '../_shared/actions/reservations.actions'


export class ReservationsPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initReservations()
  }

  render() {
    const { state, mobileHeader, actions } = this.props
    const { router } = this.context

    const back = () => {
      router.push(paths.MENU)
    }

    const add = () => {
      router.push(paths.RESERVATION_ADD)
    }

    const tableContent = (reservation, index) => {
      return (
        { label: reservation.place.floor.garage.name
        , row: <ReservationRow reservation={reservation} />
        , onClick: () => {
            router.push(`${paths.RESERVATION_GET}/${reservation.id}`)
          }
        }
      )
    }

    return (
      <Page label="My reservations" back={back} add={add} margin={true}>
        <MobileTable content={state.reservations
          .filter( (reservation) => {return mobileHeader.garage_id == undefined ? true : reservation.place.floor.garage.id == mobileHeader.garage_id } )
          .map( tableContent )} />
      </Page>
    )
  }
}

export default connect(state => {
  const { reservations, mobileHeader } = state
  return ({
    state: reservations,
    mobileHeader
  })
}, dispatch => ({
  actions: bindActionCreators(reservationsActions, dispatch)
}))(ReservationsPage)

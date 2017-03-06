import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux'
import { connect }                      from 'react-redux'

import styles from './reservation.page.scss'

import Page           from '../_shared/containers/mobilePage/Page'
import MobileTable    from '../_shared/components/mobileTable/MobileTable'
import { formatDate } from '../_shared/components/mobileTable/ReservationRow'

import * as paths               from '../_resources/constants/RouterPaths'
import * as reservationsActions from '../_shared/actions/reservations.actions'


export class ReservationPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    params:  PropTypes.object,
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  render() {
    const { state, actions, params } = this.props
    const { router } = this.context

    const back = () => {
      router.push(paths.RESERVATIONS)
    }

    const remove = () => {
      actions.destroyReservation(parseInt(params.id))
      router.push(paths.RESERVATIONS)
    }

    const row = (content) => {
      return(
        <div className={styles.row}> {content} </div>
      )
    }

    const reservation = state.reservations.find(function(reservation){return reservation.id == params.id})

    const content = [
      {label: 'Garage', row: row(reservation.place.floor.garage.name)},
      {label: 'Place',  row: row(`${reservation.place.floor.label} / ${reservation.place.label}`)},
      {label: 'Begins', row: row(formatDate(reservation.begins_at))},
      {label: 'Ends',   row: row(formatDate(reservation.ends_at))}
    ]

    return (
      <Page label="Reservation details" back={back} margin={true}> {/* remove={remove} */}
        <MobileTable content={content} />
      </Page>
    )
  }
}

export default connect(state => {
  const { reservations } = state
  return ({
    state: reservations
  })
}, dispatch => ({
  actions: bindActionCreators(reservationsActions, dispatch)
}))(ReservationPage)

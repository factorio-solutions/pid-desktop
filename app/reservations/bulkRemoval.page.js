import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import PageBase           from '../_shared/containers/pageBase/PageBase'
import PaginatedTable     from '../_shared/components/table/PaginatedTable'
import RoundButyton       from '../_shared/components/buttons/RoundButton'
import LabeledRoundButton from '../_shared/components/buttons/LabeledRoundButton'
import Form               from '../_shared/components/form/Form'
import Modal              from '../_shared/components/modal/Modal'
import TabMenu            from '../_shared/components/tabMenu/TabMenu'
import Checkbox           from '../_shared/components/checkbox/checkbox'

import * as nav                                      from '../_shared/helpers/navigation'
import * as bulkRemovalActions                       from '../_shared/actions/reservationsBulkRemoval.actions'
import * as reservationInteruptionActions            from '../_shared/actions/reservationInteruption.actions'
import { setCustomModal }                            from '../_shared/actions/pageBase.actions'
import { t }                                         from '../_shared/modules/localization/localization'
import { MOMENT_DATETIME_FORMAT }                    from '../_shared/helpers/time'
import { GET_RESERVATIONS_PAGINATION_DESKTOP_QUERY } from '../_shared/queries/reservations.queries'

import styles from './bulkRemoval.page.scss'


class BulkRemovalReservationPage extends Component {

  static propTypes = {
    state:    PropTypes.object,
    actions:  PropTypes.object,
    params:   PropTypes.object,
    pageBase: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initReservations() // TODO: Needs to be implemented
  }

  render() {
    const { state, actions } = this.props
    const allGarages = state.garages

    const formatReservation = reservation => {
      const startsAt = moment(reservation.begins_at).format(MOMENT_DATETIME_FORMAT)
      const endsAt = moment(reservation.ends_at).format(MOMENT_DATETIME_FORMAT)
      const onChecked = () => {
        actions.setReservationToBeRemove(reservation.id)
      }
      return (
        <Checkbox
          checked={state.toBeRemoved.includes(reservation.id)}
          onChange={onChecked}
        > {startsAt} - {endsAt}
        </Checkbox>
      )
    }

    const formatClient = client => {
      
      const onChecked = () => {
        client.reservations.forEach(reservation => {
          actions.setReservationToBeRemove(reservation.id)
        })
      }

      const isChecked = () => {
        const { toBeRemoved } = state
        return client.reservations.reduce((acc, reserv) => {
          return acc && toBeRemoved.includes(reserv.id)
        }, true)
      }
      return (
        <div>
          <Checkbox
            checked={isChecked()}
            onChange={onChecked}
          > <h3> {client.name} </h3>
          </Checkbox>
          <ul>
            {client.reservations.map(formatReservation)}
          </ul>
        </div>
      )
    }

    const formatGarage = garage => {

      const isChecked = () => {
        const { toBeRemoved } = state
        return garage.clients.reduce((acc, client) => {
          return acc && client.reservations.reduce((accc, reservation) => {
            return accc && toBeRemoved.includes(reservation.id)
          }, acc)
        }, true)
      }
      return (
        <div>
          <Checkbox
            checked={isChecked}
            // onChange={}
          />
          {garage.clients.map(formatClient)}
        </div>
      )
    }

    return (
      <PageBase>
        <div className={styles.leftCollumn}>
          <div className={styles.padding}>
            {allGarages.map(formatGarage)}
          </div>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.reservationBulkRemoval, pageBase: state.pageBase }),
  dispatch => ({
    actions: bindActionCreators({ ...bulkRemovalActions, setCustomModal }, dispatch)
  })
)(BulkRemovalReservationPage)

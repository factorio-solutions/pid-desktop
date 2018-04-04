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
import Dropdown           from '../_shared/components/dropdown/Dropdown'
import DatetimeInput      from '../_shared/components/input/DatetimeInput'
import ButtonStack        from '../_shared/components/buttonStack/ButtonStack'
import CallToActionButton from '../_shared/components/buttons/CallToActionButton'

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
    // this.props.actions.initReservations() // TODO: Needs to be implemented
    this.props.actions.loadAvailableUsers()
  }

  getUserToSelect = () => {
    const { state } = this.props
    return state.availableUsers.findIndex(user => state.userId && user.id === state.userId)
  }

  userDropdown = () => this.props.state.availableUsers.map(user => ({
    label:   user.full_name,
    order:   user.id === this.props.pageBase.current_user.id ? 1 : undefined,
          // TODO: Need to changed
    onClick: () => this.props.actions.setUserId(user.id)
  }))

  formatReservation = reservation => {
    const { actions, state } = this.props
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

  formatClient = client => {
    const { actions, state } = this.props
    const onChange = event => {
      if (event.target.checked) {
        actions.setClientsReservationsToBeRemove(client)
      } else {
        actions.unsetClientsReservationsToBeRemove(client)
      }
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
          onChange={onChange}
        > <h3> {client.name} </h3>
        </Checkbox>
        <ul>
          {client.reservations.map(this.formatReservation)}
        </ul>
      </div>
    )
  }

  formatGarage = garage => {
    const { actions, state } = this.props
    const onChange = event => {
      if (event.target.checked) {
        garage.clients.forEach(client => {
          actions.setClientsReservationsToBeRemove(client)
        })
      } else {
        garage.clients.forEach(client => {
          actions.unsetClientsReservationsToBeRemove(client)
        })
      }
    }
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
          checked={isChecked()}
          onChange={onChange}
        > <h2> {garage.name} </h2>
        </Checkbox>
        <ul>
          {garage.clients.map(this.formatClient)}
        </ul>
      </div>
    )
  }

  render() {
    const { state, actions, pageBase } = this.props
    const allGarages = state.garages

    const beginsInlineMenu = <span className={styles.clickable} onClick={actions.beginsToNow}>{t([ 'newReservation', 'now' ])}</span>
    const endsInlineMenu = (<ButtonStack style="horizontal" divider={<span> | </span>}>
      <span className={`${state.durationDate ? styles.selected : styles.clickable}`} onClick={this.handleDuration} >{t([ 'newReservation', 'duration' ])}</span>
      <span className={`${!state.durationDate ? styles.selected : styles.clickable}`} onClick={this.handleDate} >{t([ 'newReservation', 'date' ])}</span>
    </ButtonStack>)

    return (
      <PageBase>
        {((state.user && pageBase.current_user && state.user.id !== pageBase.current_user.id) || state.availableUsers.length > 1) &&
          <div>
            <Dropdown
              label={t([ 'newReservation', 'selectUser' ])}
              content={this.userDropdown()}
              selected={this.getUserToSelect()}
              highlight={state.highlight}
              filter
            />
            <DatetimeInput
              onBlur={actions.formatFrom}
              onChange={actions.setFrom}
              label={t([ 'newReservation', 'begins' ])}
              error={t([ 'newReservation', 'invalidaDate' ])}
              value={state.from}
              inlineMenu={beginsInlineMenu}
            />
            <DatetimeInput
              onBlur={actions.formatTo}
              onChange={actions.setTo}
              label={t([ 'newReservation', 'ends' ])}
              error={t([ 'newReservation', 'invalidaDate' ])}
              value={state.to}
              inlineMenu={endsInlineMenu}
            />
            <CallToActionButton
              label="Najít Rezervace"
              onClick={() => actions.loadReservations()}
            />
          </div>
        }
        <div className={styles.leftCollumn}>
          <div className={styles.padding}>
            {allGarages.map(this.formatGarage)}
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

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import Form from '../../_shared/components/form/Form'
import Input from '../../_shared/components/input/Input'
import DateInput from '../../_shared/components/input/DateInput'

import * as generatorActions from '../../_shared/actions/pid-admin.generator.actions'
import { t } from '../../_shared/modules/localization/localization'
import * as nav from '../../_shared/helpers/navigation'

import styles from './generator.page.scss'


class PidAdminGeneratorReservationsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  onBack() {
    nav.to('/pid-admin/generator/clients')
  }

  onSubmit() {
    nav.to('/pid-admin/generator/users')
  }

  isSubmitable() {
    const { state } = this.props
    return state.count &&
      state.dateFrom &&
      state.dateTo &&
      state.days.length &&
      !isNaN(state.dayFrom) &&
      !isNaN(state.dayTo) &&
      !isNaN(state.durationFrom) &&
      !isNaN(state.durationTo)
  }

  render() {
    const { state, actions } = this.props

    // const onBack = () => nav.to('/pid-admin/generator/clients')
    // const onSubmit = () => nav.to('/pid-admin/generator/users')
    // const isSubmitable = state.count &&
    //   state.dateFrom &&
    //   state.dateTo &&
    //   state.days.length &&
    //   !isNaN(state.dayFrom) &&
    //   !isNaN(state.dayTo) &&
    //   !isNaN(state.durationFrom) &&
    //   !isNaN(state.durationTo)

    const createDayNames = (d, index) => {
      const day = moment().weekday(index)
      return { name: moment([ '2015', '07', 12 + index ].join('-')).format('dd'), index: day.weekday() }
    }

    const toCheckbox = day => {
      const onClick = () => actions.toggleDay(day.index)
      return <span className={styles.checkbox}><input type="checkbox" checked={state.days.indexOf(day.index) > -1} onChange={onClick} />{day.name}</span>
    }

    return (
      <PageBase>
        <div className={styles.marginBot}>
          <h1>{t([ 'pidAdmin', 'generator', 'generateReservations' ])}</h1>
          <Form onSubmit={this.onSubmit} submitable={this.isSubmitable()} onBack={this.onBack} margin>
            <Input value={state.count} onChange={actions.setCount} label={t([ 'pidAdmin', 'generator', 'count' ])} error={t([ 'pidAdmin', 'generator', 'countInvalid' ])} type="number" />

            <DateInput value={state.dateFrom} onChange={actions.setDateFrom} label={t([ 'pidAdmin', 'generator', 'dateFrom' ])} error={t([ 'pidAdmin', 'generator', 'dateInvalid' ])} />
            <DateInput value={state.dateTo} onChange={actions.setDateTo} label={t([ 'pidAdmin', 'generator', 'dateTo' ])} error={t([ 'pidAdmin', 'generator', 'dateInvalid' ])} />

            <div>
              {Array(...{ length: 7 }).map(createDayNames).map(toCheckbox)}
            </div>

            <div className={styles.inline}>
              <Input value={state.dayFrom} onChange={actions.setDayFrom} label={t([ 'pidAdmin', 'generator', 'dayFrom' ])} error={t([ 'pidAdmin', 'generator', 'dayFromInvalid' ])} type="number" />
              :00
            </div>
            <div className={styles.inline}>
              <Input value={state.dayTo} onChange={actions.setDayTo} label={t([ 'pidAdmin', 'generator', 'dayTo' ])} error={t([ 'pidAdmin', 'generator', 'dayFromInvalid' ])} type="number" />
              :00
            </div>

            <div className={styles.inline}>
              <Input
                value={state.durationFrom}
                onChange={actions.setDurationFrom}
                label={t([ 'pidAdmin', 'generator', 'durationFrom' ])}
                error={t([ 'pidAdmin', 'generator', 'durationFromInvalid' ])}
                type="number"
              />
              {t([ 'pidAdmin', 'generator', 'hours' ])}
            </div>
            <div className={styles.inline}>
              <Input
                value={state.durationTo}
                onChange={actions.setDurationTo}
                label={t([ 'pidAdmin', 'generator', 'durationTo' ])}
                error={t([ 'pidAdmin', 'generator', 'durationFromInvalid' ])}
                type="number"
              />
              {t([ 'pidAdmin', 'generator', 'hours' ])}
            </div>

            <div className={styles.inline}>
              <span className={styles.checkbox}>
                <input type="checkbox" checked={state.internal} onChange={actions.toggleInternal} />
                {t([ 'pidAdmin', 'generator', 'internal' ])}
              </span>
              <span className={styles.checkbox}>
                <input type="checkbox" checked={!state.internal} onChange={actions.toggleInternal} />
                {t([ 'pidAdmin', 'generator', 'host' ])}
              </span>
            </div>

          </Form>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminGenerator }),
  dispatch => ({ actions: bindActionCreators(generatorActions, dispatch) })
)(PidAdminGeneratorReservationsPage)

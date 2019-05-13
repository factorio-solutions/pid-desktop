import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import moment from 'moment'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import Table from '../../_shared/components/table/Table'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'

import * as generatorActions from '../../_shared/actions/pid-admin.generator.actions'
import { toPidAdmin } from '../../_shared/actions/pageBase.actions'

import { t } from '../../_shared/modules/localization/localization'
import * as nav from '../../_shared/helpers/navigation'


class PidAdminGeneratorOverviewPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  keepOnClick() {
    nav.to('/pid-admin/generator')
  }

  render() {
    const { state, actions } = this.props

    const schema = [
      {
        key:        'id',
        title:      t([ 'pidAdmin', 'generator', 'id' ]),
        comparator: 'number',
        sort:       'asc'
      },
      {
        key:         'begins_at',
        title:       t([ 'pidAdmin', 'generator', 'beginsAt' ]),
        comparator:  'date',
        representer: o => (
          <span>
            { moment(o).format('ddd DD.MM.')}
            {' '}
            <br />
            {' '}
            {moment(o).format('H:mm')}
          </span>
        )
      },
      {
        key:         'ends_at',
        title:       t([ 'pidAdmin', 'generator', 'endsAt' ]),
        comparator:  'date',
        representer: o => (
          <span>
            { moment(o).format('ddd DD.MM.')}
            {' '}
            <br />
            {' '}
            {moment(o).format('H:mm')}
          </span>
        )
      },
      { key: 'userName', title: t([ 'pidAdmin', 'generator', 'userName' ]), comparator: 'string' },
      { key: 'clientName', title: t([ 'pidAdmin', 'generator', 'clientName' ]), comparator: 'string' }
    ]

    // const onKeepClick = () => nav.to('/pid-admin/generator')

    return (
      <React.Fragment>
        <h1>{t([ 'pidAdmin', 'generator', 'generateReservations' ])}</h1>
        <Table schema={schema} data={state.reservations} />
        <div>
          <CallToActionButton
            label={t([ 'pidAdmin', 'generator', 'removeReservations' ])}
            onClick={actions.removeReservations}
            type="remove"
          />
          <CallToActionButton
            label={t([ 'pidAdmin', 'generator', 'keepReservations' ])}
            onClick={this.keepOnClick}
          />
        </div>
      </React.Fragment>
    )
  }
}

const enhancers = compose(
  withMasterPageConf(toPidAdmin('generator')),
  connect(
    state => ({ state: state.pidAdminGenerator }),
    dispatch => ({ actions: bindActionCreators(generatorActions, dispatch) })
  )
)

export default enhancers(PidAdminGeneratorOverviewPage)

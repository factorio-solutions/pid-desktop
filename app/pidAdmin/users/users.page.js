import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import moment from 'moment'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import PaginatedTable from '../../_shared/components/table/PaginatedTable'
import LabeledRoundButton from '../../_shared/components/buttons/LabeledRoundButton'

import { toPidAdmin } from '../../_shared/actions/pageBase.actions'
import * as usersActions from '../../_shared/actions/pid-admin.users.actions'
import { t } from '../../_shared/modules/localization/localization'
import { USERS_PAGINATED_TABLE } from '../../_shared/queries/pid-admin.users.queries'


class PidAdminDashboardPage extends Component {
  static propTypes = {
    actions: PropTypes.object
  }

  render() {
    const { actions } = this.props

    const schema = [
      {
        key:        'id',
        title:      t([ 'pidAdmin', 'users', 'id' ]),
        comparator: 'number',
        orderBy:    'id',
        sort:       'asc'
      },
      {
        key:        'full_name',
        title:      t([ 'pidAdmin', 'users', 'name' ]),
        comparator: 'string',
        orderBy:    'full_name'
      },
      {
        key:        'email',
        title:      t([ 'clientUsers', 'email' ]),
        comparator: 'string',
        orderBy:    'email'
      },
      {
        key:        'mobile_app_version',
        title:      t([ 'pidAdmin', 'users', 'appVersion' ]),
        comparator: 'string',
        orderBy:    'mobile_app_version'
      },
      {
        key:         'last_active',
        title:       t([ 'pidAdmin', 'users', 'lastActive' ]),
        comparator:  'date',
        representer: o => (
          <span>
            {moment(o).isValid()
              ? [ moment(o).format('ddd DD.MM.'), <br />, moment(o).format('H:mm') ]
              : 'Never active'}
          </span>
        ),
        orderBy: 'last_active'
      }
    ]

    const transformData = data => data.users.map(user => ({
      ...user,
      spoiler: user.last_active
        ? (
          <LabeledRoundButton
            label={t([ 'pidAdmin', 'users', 'impersonate' ])}
            content={<span className="fa fa-user-secret" aria-hidden="true" />}
            onClick={() => actions.impersonate(user.id)}
            type="action"
          />
        )
        : undefined
    }))

    return (
      <PaginatedTable
        schema={schema}
        query={USERS_PAGINATED_TABLE}
        transformData={transformData}
        parseMetadata={data => data.users_metadata}
        admin
      />
    )
  }
}

const enhancers = compose(
  withMasterPageConf(toPidAdmin('users')),
  connect(
    null,
    dispatch => ({ actions: bindActionCreators(usersActions, dispatch) })
  )
)

export default enhancers(PidAdminDashboardPage)

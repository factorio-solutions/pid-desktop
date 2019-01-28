import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import PageBase               from '../../_shared/containers/adminPageBase/PageBase'
import Table                  from '../../_shared/components/table/Table'
import { t }                  from '../../_shared/modules/localization/localization'
import { MOMENT_DATE_FORMAT } from '../../_shared/helpers/time'

import { initState } from '../../_shared/actions/pid-admin.garagesOverview.actions'


class GaragesOverview extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initState()
  }

  boolSchema = key => ({
    key,
    title:       t([ 'pidAdmin', 'garagesOverview', key ]),
    comparator:  'boolean',
    representer: o => <i className={o ? 'fa fa-check-circle' : 'fa fa-times-circle'} style={{ color: o ? 'green' : 'red' }} aria-hidden="true" />,
    enum:        [ true, false ]
  })

  makesContacts = person => `${person.full_name} (${person.phone}, ${person.email})`

  makeSpoiler = garage => (
    <div>
      {t([ 'pidAdmin', 'garagesOverview', 'createdAt' ])}: {moment(garage.created_at).format(MOMENT_DATE_FORMAT)}<br />
      {t([ 'pidAdmin', 'garagesOverview', 'admin' ])}: {garage.admins.map(this.makesContacts).join(', ')}
      {garage.managers.length > 0 && (
        <div>
          {t([ 'pidAdmin', 'garagesOverview', 'manager' ])}: {garage.managers.map(this.makesContacts).join(', ')}
        </div>
      )
      }
    </div>
  )

  transformGarages = garage => ({
    ...garage,
    marketing: garage.marketing.active_marketing_launched,
    tarif:     t([ 'pidAdmin', 'garagesOverview', garage.active_pid_tarif.name ]),
    spoiler:   this.makeSpoiler(garage)
  })

  render() {
    const { state } = this.props

    const schema = [
      { key: 'id', title: 'ID', comparator: 'number', sort: 'asc' },
      { key: 'name', title: t([ 'pidAdmin', 'garagesOverview', 'garageName' ]), comparator: 'string' },
      { key: 'place_count', title: t([ 'pidAdmin', 'garagesOverview', 'places' ]), comparator: 'string' },
      { key: 'tarif', title: t([ 'pidAdmin', 'garagesOverview', 'tarif' ]), comparator: 'string' },
      this.boolSchema('is_public'),
      this.boolSchema('go_internal'),
      this.boolSchema('flexiplace'),
      this.boolSchema('marketing'),
      this.boolSchema('third_party_integration'),
      this.boolSchema('mr_parkit_integration')
    ]

    return (
      <PageBase>
        <Table
          schema={schema}
          data={state.garages.map(this.transformGarages)}
          searchBar
          searchBox={false}
        />
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminGaragesOverview }),
  dispatch => ({ actions: bindActionCreators({ initState }, dispatch) })
)(GaragesOverview)

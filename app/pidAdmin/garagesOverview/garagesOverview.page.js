import React, { Component, PropTypes }   from 'react'
import { connect }                       from 'react-redux'
import { bindActionCreators }            from 'redux'
import moment                            from 'moment'

import PageBase           from '../../_shared/containers/adminPageBase/PageBase'
import Table              from '../../_shared/components/table/Table'
import { t }              from '../../_shared/modules/localization/localization'
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

  boolSchema = (key, title) => ({
    key,
    title:       t([ 'pidAdmin', 'garagesOverview', title ]),
    comparator:  'boolean',
    representer: o => <i className={o ? 'fa fa-check-circle' : 'fa fa-times-circle'} style={{ color: o ? 'green' : 'red' }} aria-hidden="true" />,
    enum:        [ true, false ]
  })

  makesContacts = (acc, contact, index) => {
    let text = acc
    if (index > 0) {
      text += ', '
    }
    text += `${contact.full_name}(${contact.phone}, ${contact.email})`
    return text
  }

  makeSpoiler = garage => (
    <div>
      {t([ 'pidAdmin', 'garagesOverview', 'createdAt' ])}: {moment(garage.created_at).format(MOMENT_DATE_FORMAT)}<br />
      {t([ 'pidAdmin', 'garagesOverview', 'admin' ])}: {garage.admins.reduce(this.makesContacts, '')}
      { this.managers && this.managers.lenght > 0 &&
        <div>
          {t([ 'garagesOverview', 'manager' ])}: {garage.managers.reduce(this.makesContacts, '')}
        </div>
      }
    </div>)

  transformGarages = garage => ({
    id:         garage.id,
    name:       garage.name,
    places:     garage.place_count,
    tarif:      t([ 'pidAdmin', 'garagesOverview', garage.active_pid_tarif.name ]),
    goPublic:   garage.is_public,
    goInternal: garage.go_internal,
    fexi:       garage.flexiplace,
    marketing:  garage.marketing.active_marketing_launched,
    thirdParty: garage.third_party_integration,
    mrParkit:   garage.mr_parkit_integration,
    spoiler:    this.makeSpoiler(garage)
  })

  render() {
    const { state } = this.props

    const schema = [
      { key: 'id', title: 'ID', comparator: 'number', sort: 'asc' },
      { key: 'name', title: t([ 'pidAdmin', 'garagesOverview', 'garageName' ]), comparator: 'string' },
      { key: 'places', title: t([ 'pidAdmin', 'garagesOverview', 'places' ]), comparator: 'string' },
      { key: 'tarif', title: t([ 'pidAdmin', 'garagesOverview', 'tarif' ]), comparator: 'string' },
      this.boolSchema('goPublic', 'goPublic'),
      this.boolSchema('goInternal', 'goInternal'),
      this.boolSchema('flexi', 'flexiPlace'),
      this.boolSchema('marketing', 'marketing'),
      this.boolSchema('thirdParty', 'thirdPartyIntegration'),
      this.boolSchema('mrParkit', 'mrParkitIntegration')
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

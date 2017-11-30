import React, { Component, PropTypes }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import Table from '../../_shared/components/table/Table'
import Form from '../../_shared/components/form/Form'

import * as generatorActions from '../../_shared/actions/pid-admin.generator.actions'
import { t } from '../../_shared/modules/localization/localization'
import * as nav from '../../_shared/helpers/navigation'


class PidAdminGeneratorGaragesPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initGarages()
  }

  render() {
    const { state, actions } = this.props

    const garageCheck = id => () => actions.toggleGarage(id)

    const schema = [
      { key:         'id',
        title:       t([ 'pidAdmin', 'generator', 'selected' ]),
        comparator:  'boolean',
        representer: o => <input type="checkbox" checked={state.garages.findById(o).selected} onChange={garageCheck(o)} />
      },
      { key: 'id', title: t([ 'pidAdmin', 'generator', 'id' ]), comparator: 'number', sort: 'asc' },
      { key: 'name', title: t([ 'pidAdmin', 'generator', 'name' ]), comparator: 'string' }
    ]

    const onSubmit = () => nav.to('/pid-admin/generator/clients')
    const isSubmitable = !!state.garages.filter(g => g.selected).length

    return (
      <PageBase>
        <Form onSubmit={onSubmit} submitable={isSubmitable}>
          <h1>{t([ 'pidAdmin', 'generator', 'selectGarages' ])}</h1>
          <Table schema={schema} data={state.garages} />
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminGenerator }),
  dispatch => ({ actions: bindActionCreators(generatorActions, dispatch) })
)(PidAdminGeneratorGaragesPage)

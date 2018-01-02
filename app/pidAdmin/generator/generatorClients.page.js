import React, { Component, PropTypes }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import Table from '../../_shared/components/table/Table'
import Form from '../../_shared/components/form/Form'

import * as generatorActions from '../../_shared/actions/pid-admin.generator.actions'
import { t } from '../../_shared/modules/localization/localization'
import * as nav from '../../_shared/helpers/navigation'

import styles from './generator.page.scss'


class PidAdminGeneratorClientsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initClients()
  }

  onClientClick(id) {
    return () => this.props.actions.toggleClient(id)
  }

  onSubmit() {
    nav.to('/pid-admin/generator/reservations')
  }

  onBack() {
    nav.to('/pid-admin/generator')
  }

  isSubmitable() {
    return this.props.state.clients.filter(c => c.selected).length
  }

  render() {
    const { state, actions } = this.props

    // const clientCheck = id => () => actions.toggleClient(id)

    const schema = [
      { key:         'id',
        title:       t([ 'pidAdmin', 'generator', 'selected' ]),
        comparator:  'boolean',
        representer: o => <input type="checkbox" checked={state.clients.findById(o).selected} onChange={this.onClientClick(o)} />
      },
      { key: 'id', title: t([ 'pidAdmin', 'generator', 'id' ]), comparator: 'number', sort: 'asc' },
      { key: 'name', title: t([ 'pidAdmin', 'generator', 'name' ]), comparator: 'string' }
    ]

    // const onSubmit = () => nav.to('/pid-admin/generator/reservations')
    // const onBack = () => nav.to('/pid-admin/generator')
    // const isSubmitable = !!state.clients.filter(c => c.selected).length

    return (
      <PageBase>
        <div className={styles.marginBot}>
          <Form onSubmit={this.onSubmit} submitable={this.isSubmitable()} onBack={this.onBack} margin>
            <h1>{t([ 'pidAdmin', 'generator', 'selectClients' ])}</h1>
            <Table schema={schema} data={state.clients} />
          </Form>
        </div>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminGenerator }),
  dispatch => ({ actions: bindActionCreators(generatorActions, dispatch) })
)(PidAdminGeneratorClientsPage)

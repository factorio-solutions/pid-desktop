import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import Table from '../../_shared/components/table/Table'
import Form from '../../_shared/components/form/Form'

import * as generatorActions from '../../_shared/actions/pid-admin.generator.actions'
import { toPidAdmin } from '../../_shared/actions/pageBase.actions'
import { t } from '../../_shared/modules/localization/localization'
import * as nav from '../../_shared/helpers/navigation'

import styles from './generator.page.scss'

class PidAdminGeneratorGaragesPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initGarages()
  }

  onSubmit() {
    nav.to('/pid-admin/generator/clients')
  }

  isSubmitable() {
    return !!this.props.state.garages.filter(g => g.selected).length
  }

  garageOnClick(id) {
    return () => this.props.actions.toggleGarage(id)
  }

  render() {
    const { state } = this.props

    // const garageCheck = id => () => actions.toggleGarage(id)

    const schema = [
      {
        key:         'id',
        title:       t([ 'pidAdmin', 'generator', 'selected' ]),
        comparator:  'boolean',
        representer: o => <input type="checkbox" checked={state.garages.findById(o).selected} onChange={this.garageOnClick(o)} />
      },
      {
        key:        'id', title:      t([ 'pidAdmin', 'generator', 'id' ]), comparator: 'number', sort:       'asc'
      },
      { key: 'name', title: t([ 'pidAdmin', 'generator', 'name' ]), comparator: 'string' }
    ]

    // const onSubmit = () => nav.to('/pid-admin/generator/clients')
    // const isSubmitable = !!state.garages.filter(g => g.selected).length

    return (
      <div className={styles.marginBot}>
        <Form onSubmit={this.onSubmit} submitable={this.isSubmitable()} margin>
          <h1>{t([ 'pidAdmin', 'generator', 'selectGarages' ])}</h1>
          <Table schema={schema} data={state.garages} />
        </Form>
      </div>
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

export default enhancers(PidAdminGeneratorGaragesPage)

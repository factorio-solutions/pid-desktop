import React, { Component, PropTypes }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import Table from '../../_shared/components/table/Table'
import Form from '../../_shared/components/form/Form'
import Input from '../../_shared/components/input/Input'
import CallToActionButton from '../../_shared/components/buttons/CallToActionButton'

import * as generatorActions from '../../_shared/actions/pid-admin.generator.actions'
import { t } from '../../_shared/modules/localization/localization'
import * as nav from '../../_shared/helpers/navigation'

import styles from './generator.page.scss'


class PidAdminGeneratorUsersPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initUsers()
  }

  render() {
    const { state, actions } = this.props

    const userCheck = id => () => actions.toggleUser(id)

    const schema = [
      { key:         'id',
        title:       t([ 'pidAdmin', 'generator', 'selected' ]),
        comparator:  'boolean',
        representer: o => <input type="checkbox" checked={state.users.findById(o).selected} onChange={userCheck(o)} />
      },
      { key: 'id', title: t([ 'pidAdmin', 'generator', 'id' ]), comparator: 'number', sort: 'asc' },
      { key: 'full_name', title: t([ 'pidAdmin', 'generator', 'name' ]), comparator: 'string' },
      { key: 'client_id', title: t([ 'pidAdmin', 'generator', 'clientName' ]), comparator: 'number' },
      { key: 'client_name', title: t([ 'pidAdmin', 'generator', 'clientId' ]), comparator: 'string' }
    ]

    const onBack = () => nav.to('/pid-admin/generator/reservations')
    const isSubmitable = state.createUsers ? !isNaN(state.userCount) : state.users.filter(u => u.selected).length

    return (
      <PageBase>
        <Form onSubmit={actions.generateReservations} submitable={isSubmitable} onBack={onBack}>
          {/*<span>
            <input type="checkbox" checked={!state.createUsers} onChange={actions.toggleCreateUsers} />
            {t([ 'pidAdmin', 'generator', 'selectUsers' ])}
          </span>*/}
          <Table schema={schema} data={state.users} />
          <div>
            <CallToActionButton label={t([ 'pidAdmin', 'generator', 'selectAll' ])} onClick={actions.selectAllUsers} />
            <CallToActionButton label={t([ 'pidAdmin', 'generator', 'deselectAll' ])} onClick={actions.deselectAllUsers} />
          </div>

          {/*<h1 className={styles.center}>{t([ 'pidAdmin', 'generator', 'or' ])}</h1>

          <span >
            <input type="checkbox" checked={state.createUsers} onChange={actions.toggleCreateUsers} />
            {t([ 'pidAdmin', 'generator', 'createUsers' ])}
          </span>
          <div className={styles.inline}>
            {t([ 'pidAdmin', 'generator', 'create' ])}
            <Input value={state.userCount} onChange={actions.setUsersCount} label={t([ 'pidAdmin', 'generator', 'count' ])} error={t([ 'pidAdmin', 'generator', 'countInvalid' ])} type="number" />
            {t([ 'pidAdmin', 'generator', 'users' ])}
          </div>*/}
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminGenerator }),
  dispatch => ({ actions: bindActionCreators(generatorActions, dispatch) })
)(PidAdminGeneratorUsersPage)

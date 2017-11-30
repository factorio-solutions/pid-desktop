import React, { Component, PropTypes }   from 'react'
import { connect }            from 'react-redux'
import { bindActionCreators } from 'redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import Table from '../../_shared/components/table/Table'

import * as generatorActions from '../../_shared/actions/pid-admin.generator.actions'
import { t } from '../../_shared/modules/localization/localization'


class PidAdminGeneratorOverviewPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    return (
      <PageBase>
        <h1>{t([ 'pidAdmin', 'generator', 'generateReservations' ])}</h1>

      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminGenerator }),
  dispatch => ({ actions: bindActionCreators(generatorActions, dispatch) })
)(PidAdminGeneratorOverviewPage)

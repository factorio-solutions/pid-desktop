import React, { Component, PropTypes } from 'react';
import { request }                     from '../_shared/helpers/request'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../_shared/containers/pageBase/PageBase'
import Localization from '../_shared/components/localization/Localization'

import * as nav from '../_shared/helpers/navigation'
import { t }    from '../_shared/modules/localization/localization'

import * as pageBaseActions from '../_shared/actions/pageBase.actions'


export class SettingsPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  render() {
    const {state, actions} = this.props

    const content = <div>
      <div>
        <input type="checkbox" checked={state.current_user && state.current_user.hint || false} onChange={actions.changeHints}/> {t(['settings', 'hints'])}
      </div>
      <div>
        {t(['settings', 'language'])}
        <Localization />
      </div>
    </div>

    return (
      <PageBase content={content} />
    );
  }
}

export default connect(state => {
  const { pageBase } = state
  return ({
    state: pageBase
  })
}, dispatch => ({
  actions: bindActionCreators(pageBaseActions, dispatch)
}))(SettingsPage)

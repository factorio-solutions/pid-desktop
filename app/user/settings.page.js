<<<<<<< HEAD
import React, { Component, PropTypes } from 'react';
=======
import React, { Component, PropTypes } from 'react'
>>>>>>> feature/new_api
import { request }                     from '../_shared/helpers/request'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

<<<<<<< HEAD
import PageBase from '../_shared/containers/pageBase/PageBase'
import Localization from '../_shared/components/localization/Localization'

import * as nav from '../_shared/helpers/navigation'
import { t }    from '../_shared/modules/localization/localization'

import * as pageBaseActions from '../_shared/actions/pageBase.actions'

=======
import PageBase     from '../_shared/containers/pageBase/PageBase'
import Localization from '../_shared/components/localization/Localization'
import RoundTextButton from '../_shared/components/buttons/RoundTextButton'

import * as nav             from '../_shared/helpers/navigation'
import { t }                from '../_shared/modules/localization/localization'
import * as pageBaseActions from '../_shared/actions/pageBase.actions'

import styles from './settings.page.scss'

>>>>>>> feature/new_api

export class SettingsPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  render() {
    const {state, actions} = this.props

<<<<<<< HEAD
    const content = <div>
      <div>
        <input type="checkbox" checked={state.current_user && state.current_user.hint} onClick={actions.changeHints}/> {t(['settings', 'hints'])}
      </div>
=======
    const editUserClick = () => { nav.to('/editUser') }

    const content = <div>
      <div className={styles.editUserButton}>
        <RoundTextButton onClick={editUserClick} content={t(['settings', 'editUser'])} type="action" />
      </div>

      <div>
        <input type="checkbox" checked={state.current_user && state.current_user.hint || false} onChange={actions.changeHints}/> {t(['settings', 'hints'])}
      </div>

>>>>>>> feature/new_api
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

<<<<<<< HEAD
export default connect(state => {
  const { pageBase } = state
  return ({
    state: pageBase
  })
}, dispatch => ({
  actions: bindActionCreators(pageBaseActions, dispatch)
}))(SettingsPage)
=======
export default connect(
  state    => ({ state: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(pageBaseActions, dispatch) })
)(SettingsPage)
>>>>>>> feature/new_api

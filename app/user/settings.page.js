import React, { Component, PropTypes } from 'react'
import { request }                     from '../_shared/helpers/request'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase     from '../_shared/containers/pageBase/PageBase'
import Localization from '../_shared/components/localization/Localization'
import RoundTextButton from '../_shared/components/buttons/RoundTextButton'

import * as nav             from '../_shared/helpers/navigation'
import { t }                from '../_shared/modules/localization/localization'
import * as pageBaseActions from '../_shared/actions/pageBase.actions'

import styles from './settings.page.scss'


export class SettingsPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  render() {
    const {state, actions} = this.props

    const editUserClick = () => { nav.to('/editUser') }

    const content = <div>
      <div className={styles.editUserButton}>
        <RoundTextButton onClick={editUserClick} content={t(['settings', 'editUser'])} type="action" />
      </div>

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

export default connect(
  state    => ({ state: state.pageBase }),
  dispatch => ({ actions: bindActionCreators(pageBaseActions, dispatch) })
)(SettingsPage)

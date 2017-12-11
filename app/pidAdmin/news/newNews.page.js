import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase from '../../_shared/containers/adminPageBase/PageBase'
import Input    from '../../_shared/components/input/Input'
import Form     from '../../_shared/components/form/Form'

import * as nav            from '../../_shared/helpers/navigation'
import { t }               from '../../_shared/modules/localization/localization'
import * as newNewsActions from '../../_shared/actions/pid-admin.newNews.actions'

import styles from './newNews.page.scss'


class PidAdminNewNewsPage extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  render() {
    const { state, actions } = this.props

    const checkSubmitable = () => state.label !== ''
    const submitForm = () => { checkSubmitable() && actions.submit() }
    const goBack = () => { nav.to('/pid-admin/news') }

    return (
      <PageBase>
        <Form onSubmit={submitForm} submitable={checkSubmitable()} onBack={goBack}>
          <Input
            onEnter={submitForm}
            onChange={actions.setLabel}
            label={t([ 'pidAdmin', 'news', 'label' ])}
            value={state.label}
          />
          <Input
            onEnter={submitForm}
            onChange={actions.setUrl}
            label={t([ 'pidAdmin', 'news', 'url' ])}
            value={state.url}
          />
        </Form>
      </PageBase>
    )
  }
}

export default connect(
  state => ({ state: state.pidAdminNewNews }),
  dispatch => ({ actions: bindActionCreators(newNewsActions, dispatch) })
)(PidAdminNewNewsPage)

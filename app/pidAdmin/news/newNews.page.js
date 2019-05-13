import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import withMasterPageConf from '../../hoc/withMasterPageConf'

import Input    from '../../_shared/components/input/Input'
import Form     from '../../_shared/components/form/Form'

import * as nav            from '../../_shared/helpers/navigation'
import { t }               from '../../_shared/modules/localization/localization'
import * as newNewsActions from '../../_shared/actions/pid-admin.newNews.actions'
import { toPidAdmin } from '../../_shared/actions/pageBase.actions'

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
    )
  }
}

const enhancers = compose(
  withMasterPageConf(toPidAdmin('news')),
  connect(
    state => ({ state: state.pidAdminNewNews }),
    dispatch => ({ actions: bindActionCreators(newNewsActions, dispatch) })
  )
)

export default enhancers(PidAdminNewNewsPage)

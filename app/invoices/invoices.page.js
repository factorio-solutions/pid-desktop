import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import PageBase     from '../_shared/containers/pageBase/PageBase'

import * as nav             from '../_shared/helpers/navigation'
import { t }                from '../_shared/modules/localization/localization'
import * as invoicesActions from '../_shared/actions/invoices.actions'


export class InvoicesPage extends Component {
  static propTypes = {
    state:        PropTypes.object,
    actions:      PropTypes.object
  }

  render() {
    const {state, actions} = this.props

    const content = <div>
                      Imagine invoices here
                    </div>

    return (
      <PageBase content={content} />
    );
  }
}

export default connect(
  state    => ({ state: state.invoices }),
  dispatch => ({ actions: bindActionCreators(invoicesActions, dispatch) })
)(InvoicesPage)

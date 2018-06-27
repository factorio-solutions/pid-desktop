import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import * as legalDocumentsActions from '../../_shared/actions/legalDocuments.actions'

import PageBase  from '../../_shared/containers/pageBase/PageBase'
import TabMenu   from '../../_shared/components/tabMenu/TabMenu'
import TabButton from '../../_shared/components/buttons/TabButton'
import Privacy   from './tabs/privacy'
import Terms     from './tabs/terms'

import { t }     from '../../_shared/modules/localization/localization'

class LegalDocuments extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object
  }

  constructor(props) {
    super(props)

    props.actions.setSelected(this.tabs[0].id)
  }

  tabs = [
    { id:      'privacy',
      content: <Privacy />
    },
    { id:      'terms',
      content: <Terms />
    }
  ]

  prepareTabs = tab => (<TabButton
    label={t([ 'legalDocuments', tab.id ])}
    onClick={() => this.props.actions.setSelected(tab.id)}
    state={this.props.state.selected === tab.id && 'selected'}
  />)

  render() {
    const { state } = this.props
    const selectedTab = this.tabs.find(tab => tab.id === state.selected)
    return (
      <PageBase>
        <TabMenu left={this.tabs.map(this.prepareTabs)} />

        {selectedTab && selectedTab.content}
      </PageBase>
    )
  }

}

export default connect(
  state => ({ state: state.adminLegalDocuments }),
  dispatch => ({ actions: bindActionCreators(legalDocumentsActions, dispatch) })
)(LegalDocuments)

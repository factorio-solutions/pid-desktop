import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import * as legalDocumentsActions from '../../_shared/actions/legalDocuments.actions'
import * as nav                   from '../../_shared/helpers/navigation'

import Documents from './documents'
import GarageSetupPage from '../../_shared/containers/garageSetupPage/GarageSetupPage'
import Form from '../../_shared/components/form/Form'

class LegalDocuments extends Component {
  static propTypes = {
    state:   PropTypes.object,
    actions: PropTypes.object,
    params:  PropTypes.object
  }

  componentDidMount() {
    this.props.actions.initDocuments()
  }

  onSubmit = () => {
    if (this.props.params.id) {
      this.props.actions.updateGarageDocuments()
    } else {
      nav.to('/addFeatures/garageSetup')
    }
  }

  submitable = () => {
    return this.props.state.privacyDocuments.length >= 1
  }

  render() {
    const { state, actions } = this.props
    return (
      <GarageSetupPage>
        <Form onSubmit={this.onSubmit} submitable={this.submitable()} onHighlight={actions.toggleHighlight}>
          {state.documentsTypes &&
           state.documentsTypes.map(type => <Documents type={type} highlight={state.highlight} />)}
        </Form>
      </GarageSetupPage>
    )
  }

}

export default connect(
  state => ({ state: state.adminLegalDocuments }),
  dispatch => ({ actions: bindActionCreators(legalDocumentsActions, dispatch) })
)(LegalDocuments)

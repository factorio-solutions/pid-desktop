import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'

import Documents       from './documents'
import GarageSetupPage from '../../../_shared/containers/garageSetupPage/GarageSetupPage'
import Form            from '../../../_shared/components/form/Form'

import * as legalDocumentsActions         from '../../../_shared/actions/legalDocuments.actions'
import * as nav                           from '../../../_shared/helpers/navigation'
import { t }                              from '../../../_shared/modules/localization/localization'
import { initTarif, intiEditGarageOrder } from '../../../_shared/actions/garageSetup.actions'


class LegalDocuments extends Component {
  static propTypes = {
    state:       PropTypes.object,
    actions:     PropTypes.object,
    params:      PropTypes.object,
    garageSetup: PropTypes.object,
    pageBase:    PropTypes.object
  }

  componentDidMount() {
    if (this.props.params.id) {
      this.props.actions.initDocuments()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { garageSetup, actions, params } = this.props
    if (nextProps.params.id !== params.id) {
      this.props.actions.initDocuments()
      garageSetup.availableTarifs.length === 0 && actions.initTarif()
      nextProps.params.id && actions.intiEditGarageOrder(nextProps.params.id)
    }
  }

  onSubmit = () => {
    if (this.props.params.id) {
      this.props.actions.updateGarageDocuments()
    } else {
      nav.to('/addFeatures/garageSetup/subscribtion')
    }
  }

  goBack = () => {
    if (this.props.params.id) {
      nav.to(`/${this.props.params.id}/admin/garageSetup/order`)
    } else {
      nav.to('/addFeatures/garageSetup/order')
    }
  }

  submitable = () => this.props.state.documents.filter(doc => doc.doc_type === 'privacy' && !doc.remove).length >= 1

  isGarageAdmin = () => {
    const { pageBase, params } = this.props
    if (!params.id) {
      return true
    }

    const garage = pageBase.garages.find(g => g.garage.id === +params.id)
    if (!garage) {
      return false
    }

    return garage.admin
  }

  render() {
    const { state, actions } = this.props

    return (
      <GarageSetupPage>
        <Form onSubmit={this.onSubmit} submitable={this.submitable()} onBack={this.goBack} onHighlight={actions.toggleHighlight}>
          { state.documentsTypes &&
            state.documentsTypes.map(type => (
              <Documents
                header={`${t([ 'newGarage', type ]).firstToUpperCase()} ${t([ 'newGarage', 'documents' ])}`}
                type={type}
                documents={state.documents.filter(doc => doc.doc_type === type)}
                highlight={state.highlight}
                isGarageAdmin={this.isGarageAdmin()}
              />)
            )
          }
        </Form>
      </GarageSetupPage>
    )
  }

}

export default connect(
  state => ({ state: state.legalDocuments, garageSetup: state.garageSetup, pageBase: state.pageBase }),
  dispatch => ({ actions: bindActionCreators({ ...legalDocumentsActions, initTarif, intiEditGarageOrder }, dispatch) })
)(LegalDocuments)

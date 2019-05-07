import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import withMasterPageConf from '../../../hoc/withMasterPageConf'

import Documents       from './documents'
import Form            from '../../../_shared/components/form/Form'

import * as legalDocumentsActions         from '../../../_shared/actions/legalDocuments.actions'
import * as nav                           from '../../../_shared/helpers/navigation'
import { t }                              from '../../../_shared/modules/localization/localization'
import { initTarif, intiEditGarageOrder } from '../../../_shared/actions/garageSetup.actions'
import { toAdminGarageSetup } from '../../../_shared/actions/pageBase.actions'


class LegalDocuments extends Component {
  static propTypes = {
    state:       PropTypes.object,
    actions:     PropTypes.object,
    match:       PropTypes.object,
    garageSetup: PropTypes.object,
    pageBase:    PropTypes.object
  }

  componentDidMount() {
    const { match: { params }, actions } = this.props
    if (params.id) {
      actions.initDocuments()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { garageSetup, actions, match: { params } } = this.props
    if (nextProps.match.params.id !== params.id) {
      actions.initDocuments()
      garageSetup.availableTarifs.length === 0 && actions.initTarif()
      nextProps.match.params.id && actions.intiEditGarageOrder(nextProps.match.params.id)
    }
  }

  onSubmit = () => {
    const { match: { params }, actions } = this.props
    if (params.id) {
      actions.updateGarageDocuments()
    } else {
      nav.to('/addFeatures/garageSetup/subscribtion')
    }
  }

  goBack = () => {
    const { match: { params } } = this.props
    if (params.id) {
      nav.to(`/${params.id}/admin/garageSetup/order`)
    } else {
      nav.to('/addFeatures/garageSetup/order')
    }
  }

  submitable = () => {
    const { state: { documents } } = this.props
    return documents.some(doc => doc.doc_type === 'privacy' && !doc.remove)
  }

  isGarageAdmin = () => {
    const { pageBase, match: { params } } = this.props
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
      <Form
        onSubmit={this.onSubmit}
        submitable={this.submitable()}
        onBack={this.goBack}
        onHighlight={actions.toggleHighlight}
      >
        {state.documentsTypes
        && state.documentsTypes.map(type => (
          <Documents
            header={`${t([ 'newGarage', type ]).firstToUpperCase()} ${t([ 'newGarage', 'documents' ])}`}
            type={type}
            documents={state.documents.filter(doc => doc.doc_type === type)}
            highlight={state.highlight}
            isGarageAdmin={this.isGarageAdmin()}
          />
        ))
        }
      </Form>
    )
  }
}

const mapStateToProps = state => ({
  state:       state.legalDocuments,
  garageSetup: state.garageSetup,
  pageBase:    state.pageBase
})

const mapActionsToProps = dispatch => ({
  actions: bindActionCreators({
    ...legalDocumentsActions,
    initTarif,
    intiEditGarageOrder
  }, dispatch)
})

const enhancers = compose(
  withMasterPageConf(toAdminGarageSetup('newGarageLegalDocuments')),
  connect(
    mapStateToProps,
    mapActionsToProps
  )
)

export default enhancers(LegalDocuments)

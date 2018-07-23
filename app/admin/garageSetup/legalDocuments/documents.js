import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import Table              from '../../../_shared/components/table/Table'
import UploadButton       from '../../../_shared/components/buttons/UploadButton'
import LabeledRoundButton from '../../../_shared/components/buttons/LabeledRoundButton'
import Modal              from '../../../_shared/components/modal/Modal'
import Form               from '../../../_shared/components/form/Form'
import Input              from '../../../_shared/components/input/PatternInput'

import { t }                              from '../../../_shared/modules/localization/localization'
import { PRESIGNE_GARAGE_DOCUMENT_QUERY } from '../../../_shared/queries/legalDocuments.queries'
import { MOMENT_DATETIME_FORMAT }         from '../../../_shared/helpers/time'
import * as documentsActions              from '../../../_shared/actions/legalDocuments.actions'

import styles from './legalDocuments.page.scss'


class Documents extends Component {
  static propTypes = {
    state:         PropTypes.object,
    actions:       PropTypes.object,
    header:        PropTypes.string,
    type:          PropTypes.string,
    documents:     PropTypes.object,
    isGarageAdmin: PropTypes.bool,
    readOnly:      PropTypes.bool,
    highlight:     PropTypes.bool
  }

  makeSpoiler = document => (<div>
    {t([ 'newGarage', 'lastChangeAt' ])}: {moment(document.updated_at).format(MOMENT_DATETIME_FORMAT)}

    <span className={styles.floatRight}>
      <LabeledRoundButton
        label={t([ 'newGarage', 'showDocument' ])}
        content={<span className="fa fa-download" aria-hidden="true" />}
        type="action"
        onClick={() => window.open(document.url)}
      />

      {!this.props.readOnly && this.props.isGarageAdmin &&
        <LabeledRoundButton
          label={t([ 'newGarage', 'removeDocument' ])}
          content={<span className="fa fa-times" aria-hidden="true" />}
          type="remove"
          onClick={() => this.props.actions.destroyDocument(document)}
          question={`${t([ 'newGarage', 'removeDocumentQuestion' ])} ${document.name}`}
        />
      }
    </span>
  </div>)

  transformDocument = document => ({
    name:    document.name || 'Name of document here.',
    spoiler: this.makeSpoiler(document)
  })

  render() {
    const { state, actions, type, highlight, readOnly, documents, header } = this.props

    const schema = [
      { key: 'name', title: t([ 'newGarage', 'documentName' ]), comparator: 'string', sort: 'asc' }
    ]

    return (
      <div>
        <Modal show={state.showModal === type}>
          <Form
            onSubmit={() => actions.documentUploaded(type, state.documentURL, state.documentName)}
            onHighlight={actions.toggleHighlight}
            onBack={() => actions.showModal(false)}
            submitable={state.documentName && state.documentURL}
          >
            <Input
              onChange={actions.setDocumentName}
              label={t([ 'newGarage', 'documentName' ])}
              value={state.documentName}
              highlight={state.highlight}
            />
            <Input
              onChange={actions.setDocumentURL}
              label={t([ 'newGarage', 'documentURL' ])}
              value={state.documentURL}
              highlight={state.highlight}
              type="url"
            />
          </Form>
        </Modal>

        <h2>{header}</h2>
        {highlight && type === 'privacy' &&
          <h4>{t([ 'newGarage', 'privacyDocumentRule' ])}</h4>
        }

        {documents.filter(doc => !doc.remove).length === 0 ?
          <h3>{t([ 'newGarage', 'noDocument' ])}</h3> :
          <Table
            schema={schema}
            data={documents.filter(doc => !doc.remove).map(this.transformDocument)}
            searchBox={false}
          />
        }

        {!readOnly &&
          <div className={styles.displayFlex}>
            <UploadButton
              label={t([ 'newGarage', 'addDocument' ])}
              state={documents.filter(doc => !doc.remove && doc.doc_type === type).length > 0 ? 'disabled' : 'action'}
              onUpload={(documentUrl, fileName) => actions.documentUploaded(type, documentUrl, fileName)}
              query={PRESIGNE_GARAGE_DOCUMENT_QUERY}
              accept="application/pdf"
            />
            <h2>{t([ 'newGarage', 'or' ])}</h2>
            <LabeledRoundButton
              label={t([ 'newGarage', 'uploadUrl' ])}
              state={documents.filter(doc => !doc.remove && doc.doc_type === type).length > 0 ? 'disabled' : 'action'}
              content={<span className="fa fa-file-code-o" aria-hidden="true" />}
              onClick={() => actions.showModal(type)}
            />
          </div>
        }
      </div>
    )
  }
}
export default connect(
  state => ({ state: state.legalDocuments }),
  dispatch => ({ actions: bindActionCreators(documentsActions, dispatch) })
)(Documents)

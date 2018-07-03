import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import UploadButton               from '../../_shared/components/buttons/UploadButton'

import { t } from '../../_shared/modules/localization/localization'

import { documentUploaded, destroyDocument }       from '../../_shared/actions/legalDocuments.actions'

import {
  PRESIGNE_GARAGE_DOCUMENT_QUERY
} from '../../_shared/queries/legalDocuments.queries'
import Table                      from '../../_shared/components/table/Table'
import { MOMENT_DATETIME_FORMAT } from '../../_shared/helpers/time'
import LabeledRoundButton         from '../../_shared/components/buttons/LabeledRoundButton'

class Documents extends Component {
  static propTypes = {
    actions:       PropTypes.object,
    header:        PropTypes.string,
    type:          PropTypes.string,
    documents:     PropTypes.object,
    isGarageAdmin: PropTypes.string,
    readOnly:      PropTypes.bool,
    highlight:     PropTypes.bool
  }

  makeSpoiler = document => (<div>
    {t([ 'newGarage', 'lastChangeAt' ])}: {moment(document.updated_at).format(MOMENT_DATETIME_FORMAT)}
    <span style={{ float: 'right' }}>
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
    const { actions, type, highlight, readOnly, documents, header } = this.props

    const schema = [
      { key: 'name', title: t([ 'newGarage', 'documentName' ]), comparator: 'string', sort: 'asc' }
    ]

    return (
      <div>
        <h2>{header}</h2>
        {highlight && type === 'privacy' &&
          <h4>{t([ 'newGarage', 'privacyDocumentRule' ])}</h4>
        }
        <Table
          schema={schema}
          data={documents.filter(doc => !doc.remove).map(this.transformDocument)}
          searchBox={false}
        />
        {!readOnly &&
          <UploadButton
            label={t([ 'newGarage', 'addDocument' ])}
            type={documents.filter(doc => !doc.remove && doc.doc_type === type).length > 0 ? 'disabled' : 'action'}
            onUpload={(documentUrl, fileName) => actions.documentUploaded(type, documentUrl, fileName)}
            query={PRESIGNE_GARAGE_DOCUMENT_QUERY}
            accept="application/pdf"
          />
        }
      </div>
    )
  }
}
export default connect(
  () => ({ }),
  dispatch => ({ actions: bindActionCreators({ documentUploaded, destroyDocument }, dispatch) })
)(Documents)

import React, { Component, PropTypes } from 'react'
import { connect }                     from 'react-redux'
import { bindActionCreators }          from 'redux'
import moment                          from 'moment'

import { documentUploaded }       from '../../_shared/actions/legalDocuments.actions'
import UploadButton               from '../../_shared/components/buttons/UploadButton'

import { t } from '../../_shared/modules/localization/localization'

import {
  PRESIGNE_GARAGE_DOCUMENT_QUERY
} from '../../_shared/queries/admin.legalDocuments.queries'
import Table                      from '../../_shared/components/table/Table'
import { MOMENT_DATETIME_FORMAT } from '../../_shared/helpers/time'
import LabeledRoundButton         from '../../_shared/components/buttons/LabeledRoundButton'

class Documents extends Component {
  static propTypes = {
    state:     PropTypes.object,
    actions:   PropTypes.object,
    type:      PropTypes.string,
    highlight: PropTypes.bool
  }

  makeSpoiler = document => (<div>
    {t([ 'newGarage', 'lastChangeAt' ])}: {moment(document.updated_at).format(MOMENT_DATETIME_FORMAT)}
    <span style={{ float: 'right' }}>
      <LabeledRoundButton
        label={t([ 'legalDocuments', 'showDocument' ])}
        content={<span className="fa fa-download" aria-hidden="true" />}
        type="action"
        onClick={() => window.open(document.document)}
      />
    </span>
  </div>)

  transformDocument = document => ({
    name:    document.document_name || 'Name of document here.',
    spoiler: this.makeSpoiler(document)
  })

  render() {
    const { state, actions, type, highlight } = this.props

    const schema = [
      { key: 'name', title: t([ 'newGarage', 'documentName' ]), comparator: 'string', sort: 'asc' }
    ]
    const typeTranslation = t([ 'newGarage', type ])
    return (
      <div>
        <h2>{typeTranslation.charAt(0).toUpperCase() + typeTranslation.slice(1)} {t([ 'newGarage', 'documents' ])}</h2>
        {highlight && type === 'privacy' &&
          <h4>At least one document has to be uploaded</h4> // TODO: to lang files.
        }
        <Table
          schema={schema}
          data={state[`${type}Documents`].map(this.transformDocument)}
          searchBox={false}
        />
        <UploadButton
          label={t([ 'newGarage', 'addDocument' ])}
          type={'action'}
          onUpload={(documentUrl, fileName) => actions.documentUploaded(type, documentUrl, fileName)}
          query={PRESIGNE_GARAGE_DOCUMENT_QUERY}
          accept="application/pdf"
        />
      </div>
    )
  }
}
export default connect(
  state => ({ state: state.adminLegalDocuments }),
  dispatch => ({ actions: bindActionCreators({ documentUploaded }, dispatch) })
)(Documents)

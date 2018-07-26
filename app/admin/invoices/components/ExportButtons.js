import React, { PropTypes } from 'react'

import LabeledRoundButton from '../../../_shared/components/buttons/LabeledRoundButton'

import { t } from '../../../_shared/modules/localization/localization'

import styles from '../invoices.page.scss'


function ExportButtons({ invoices, actions }) {
  return (
    <div className={styles.actionButtons}>
      <LabeledRoundButton
        label={t([ 'invoices', 'donwloadExcel' ])}
        content={<span className="fa fa-file-excel-o" aria-hidden="true" />}
        onClick={() => actions.generateCsv(invoices)}
        type="action"
      />
      <LabeledRoundButton
        label={t([ 'invoices', 'donwloadXlsx' ])}
        content={<span className="fa fa-file-excel-o" aria-hidden="true" />}
        onClick={() => actions.generateXlsx(invoices)}
        type="action"
      />
      <LabeledRoundButton
        label={t([ 'invoices', 'donwloadInvoices' ])}
        content={<span className="fa fa-files-o" aria-hidden="true" />}
        onClick={() => actions.downloadZip(invoices)}
        type="action"
      />
    </div>
  )
}

ExportButtons.protoTypes = {
  invoices: PropTypes.array,
  actions:  PropTypes.object
}

export default ExportButtons

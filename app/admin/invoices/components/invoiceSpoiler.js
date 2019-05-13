import React from 'react'
import PropTypes from 'prop-types'

import * as nav from '../../../_shared/helpers/navigation'
import { t } from '../../../_shared/modules/localization/localization'

import LabeledRoundButton from '../../../_shared/components/buttons/LabeledRoundButton'

import styles from '../invoices.page.scss'

function invoiceCanBePayed(invoice, currentUser) {
  const invoiceCanBePayedByClient = (
    !invoice.is_storno_invoice
    && invoice.client
    && invoice.client.client_user
    && (
      invoice.client.client_user.admin
      || invoice.client.client_user.secretary
    )
  )

  const invoiceCanBePayedByUser = (
    invoice.payer_type === 'User'
    && invoice.invoice_item
    && invoice.invoice_item.invoiceable_type === 'Reservation'
    && invoice.user.id === currentUser.id
  )

  return (
    !invoice.payed
    && (
      invoiceCanBePayedByClient
      || invoiceCanBePayedByUser
    )
  )
}

function invoiceSpoiler({
  invoice,
  garage,
  currentUser,
  downloadInvoice,
  payInvoice,
  reminder,
  invoicePayed,
  toggleReason
}) {
  return (
    <React.Fragment>
      {invoice.canceled
        ? (
          <React.Fragment>
            <b>
              {t([ 'invoices', 'invoiceCanceled' ])}
              {' '}
            </b>
            {invoice.subject}
            <span className={styles.floatRight}>
              <LabeledRoundButton
                label={t([ 'invoices', 'downloadInvoice' ])}
                content={<span className="fa fa-download" aria-hidden="true" />}
                onClick={() => downloadInvoice(invoice.id, invoice.invoice_number)}
                type="action"
              />
              <LabeledRoundButton
                label={t([ 'invoices', 'editInvoice' ])}
                content={<span className="fa fa-pencil" aria-hidden="true" />}
                onClick={() => nav.to(`/${garage}/admin/invoices/${invoice.id}/edit`)}
                type="action"
              />
            </span>
          </React.Fragment>
        )
        : (
          <React.Fragment>
            {t([ 'invoices', 'subject' ])}
            {':'}
            {invoice.subject}
            <span className={styles.floatRight}>
              <LabeledRoundButton
                label={t([ 'invoices', 'downloadInvoice' ])}
                content={<span className="fa fa-download" aria-hidden="true" />}
                onClick={() => downloadInvoice(invoice.id, invoice.invoice_number)}
                type="action"
              />
              {invoiceCanBePayed(invoice, currentUser) && (
                <LabeledRoundButton
                  label={t([ 'invoices', 'payInvoice' ])}
                  content={<i className="fa fa-credit-card" aria-hidden="true" />}
                  onClick={() => payInvoice(invoice.id)}
                  type="action"
                />
              )}
              {!invoice.payed
              && !invoice.is_storno_invoice
              && invoice.account.garage.is_admin
              && (
                <React.Fragment>
                  <LabeledRoundButton
                    label={t([ 'invoices', 'sendReminder' ])}
                    content={<span className="fa fa-bell-o" aria-hidden="true" />}
                    onClick={() => reminder(invoice.id)}
                    type="action"
                  />
                  <LabeledRoundButton
                    label={t([ 'invoices', 'invoicePaidLabel' ])}
                    content={<span className="fa fa-check" aria-hidden="true" />}
                    onClick={() => invoicePayed(invoice.id, garage)}
                    type="remove"
                    question={t([ 'invoices', 'invoicePaid' ])}
                  />
                  <LabeledRoundButton
                    label={t([ 'invoices', 'invoiceIncorect' ])}
                    content={<span className="fa fa-times" aria-hidden="true" />}
                    onClick={() => toggleReason(invoice.id)}
                    type="remove"
                    question={t([ 'invoices', 'stornoInvoice' ])}
                  />
                </React.Fragment>
              )}
            </span>
          </React.Fragment>
        )}
    </React.Fragment>
  )
}

invoiceSpoiler.propTypes = {
  downloadInvoice: PropTypes.func,
  payInvoice:      PropTypes.func,
  reminder:        PropTypes.func,
  invoicePayed:    PropTypes.func,
  toggleReason:    PropTypes.func,
  garage:          PropTypes.object,
  currentUser:     PropTypes.object,
  invoice:         PropTypes.object
}

export default invoiceSpoiler

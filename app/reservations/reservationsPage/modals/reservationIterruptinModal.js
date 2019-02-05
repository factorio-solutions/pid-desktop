import React from 'react'
import PropTypes from 'prop-types'

import { t } from '../../../_shared/modules/localization/localization'

import Form from '../../../_shared/components/form/Form'
import DateTimeInput from '../../../_shared/components/input/DatetimeInput'
import Modal from '../../../_shared/components/modal/Modal'

const ModalForm = ({
  from,
  to,
  interruptReservation,
  setReservation,
  setFrom,
  setTo,
  formatFrom,
  formatTo
}) => (
  <Form
    onSubmit={interruptReservation}
    onBack={setReservation}
    submitable
    margin={false}
    modal
  >
    <h2>{t([ 'reservationInteruption', 'describtion' ])}</h2>
    <DateTimeInput
      onChange={setFrom}
      label={t([ 'reservationInteruption', 'from' ])}
      error={t([ 'reservationInteruption', 'invalidaDate' ])}
      value={from}
      onBlur={formatFrom}
    />
    <DateTimeInput
      onChange={setTo}
      label={t([ 'reservationInteruption', 'to' ])}
      error={t([ 'reservationInteruption', 'invalidaDate' ])}
      value={to}
      onBlur={formatTo}
    />
  </Form>
)

ModalForm.propTypes = {
  from:                 PropTypes.string,
  to:                   PropTypes.string,
  interruptReservation: PropTypes.func,
  setReservation:       PropTypes.func,
  setFrom:              PropTypes.func,
  setTo:                PropTypes.func,
  formatFrom:           PropTypes.func,
  formatTo:             PropTypes.func
}

const reservationInterruptionModal = ({
  showModal,
  ...props
}) => {
  return (
    <Modal
      content={<ModalForm {...props} />}
      show={showModal}
    />
  )
}

reservationInterruptionModal.propTypes = {
  showModal: PropTypes.bool
}

export default reservationInterruptionModal
